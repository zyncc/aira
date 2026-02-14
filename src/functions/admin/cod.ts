"use server";

import { db } from "@/db/instance";
import { couponRedemptions, coupons, order, quantity } from "@/db/schema";
import {
  AuthorizationErrorResponse,
  ErrorResponse,
  SuccessResponse,
} from "@/lib/api-responses";
import { Order } from "@/lib/types";
import { formatCurrency, uuid } from "@/lib/utils";
import { and, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { sendOrderReceipt } from "../auth/emails/send-order-receipt";
import { getServerSession } from "../auth/get-server-session";

export async function ApproveOrder(orderData: Order) {
  const session = await getServerSession(true);

  if (!session || session.user.role !== "admin") {
    return AuthorizationErrorResponse();
  }

  const allOrders = await db.query.order.findMany({
    where: (fields, operators) => operators.eq(fields.rzpOrderId, orderData.rzpOrderId),
    with: {
      product: true,
      user: true,
    },
  });

  const totalWeight = allOrders.reduce((acc, order) => acc + order.quantity * 250, 0);

  // Create Shipment
  const shipmentData = {
    shipments: [
      {
        name: `${orderData.firstName + " " + orderData.lastName || ""}`,
        orderData: orderData.id,
        phone: orderData.phone,
        add: `${orderData.address1}, ${orderData.address2 || ""}`,
        pin: orderData.zipcode,
        weight: totalWeight,
        payment_mode: "COD",
        cod_amount: orderData.codAmount!,
      },
    ],
    pickup_location: { name: "mahaveer-sitara-d-block" },
  };

  const formBody = new URLSearchParams({
    format: "json",
    data: JSON.stringify(shipmentData),
  });

  const createShipment = await fetch("https://track.delhivery.com/api/cmu/create.json", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
      Authorization: process.env.DELHIVERY_TOKEN!,
    },
    body: formBody,
  }).then((res) => res.json());

  const waybill = createShipment.packages?.[0]?.waybill;

  if (!waybill) {
    console.error("Failed to generate Waybill", createShipment);
    return ErrorResponse("Failed to create Shipment");
  }

  // Get delivery time
  const ttdData = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/pincode?pincode=${orderData.zipcode}`,
  ).then((res) => res.json());

  const deliveryDate = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
  );
  if (ttdData?.ttd) {
    deliveryDate.setDate(deliveryDate.getDate() + ttdData.ttd + 2);
  }

  /* Prevent Negative Stock: Check if stock is sufficient before decrementing */
  const sizeColumn =
    orderData.size === "doublexl"
      ? quantity.doublexl
      : quantity[orderData.size as keyof typeof quantity];

  const updateResult = await db
    .update(quantity)
    .set({
      [orderData.size]: sql`${sizeColumn} - ${orderData.quantity}`,
    })
    .where(
      and(
        eq(quantity.productId, orderData.productId),
        sql`${sizeColumn} >= ${orderData.quantity}`,
      ),
    )
    .returning({ id: quantity.id });

  if (updateResult.length === 0) {
    return ErrorResponse(`Insufficient stock for size ${orderData.size}`);
  }

  await db.transaction(async (tx) => {
    const usedCoupon = orderData.couponCode;
    if (usedCoupon) {
      const coupon = await tx.query.coupons.findFirst({
        where: (f, o) => o.eq(f.code, usedCoupon),
        columns: { id: true },
      });

      if (coupon) {
        const couponAlreadyRedeemed = await tx.query.couponRedemptions.findFirst({
          where: (f, o) => o.eq(f.couponId, coupon.id),
        });

        if (!couponAlreadyRedeemed) {
          await tx.insert(couponRedemptions).values({
            id: uuid(),
            userId: orderData.userId,
            couponId: coupon.id,
          });

          await tx
            .update(coupons)
            .set({
              usageCount: sql`${coupons.usageCount} + 1`,
            })
            .where(eq(coupons.id, coupon.id));
        }
      }
    }
  });

  // Update Order
  await db
    .update(order)
    .set({
      waybill,
      ttd: deliveryDate,
      isCodApproved: true,
    })
    .where(eq(order.rzpOrderId, orderData.rzpOrderId));

  try {
    // Send Email
    await sendOrderReceipt(
      waybill,
      orderData.firstName,
      orderData.id,
      allOrders,
      null,
      deliveryDate,
      orderData.email,
    );

    // Send WhatsApp messages
    const whatsappPromises = allOrders.map((order) => {
      const payload = {
        messaging_product: "whatsapp",
        to: `+91${allOrders[0].phone}`,
        type: "template",
        template: {
          name: "order_confirmed",
          language: { code: "en_US" },
          components: [
            {
              type: "header",
              parameters: [
                {
                  type: "image",
                  image: {
                    link: `${order.product.images[0]}?w=600`,
                  },
                },
              ],
            },
            {
              type: "body",
              parameters: [
                { type: "text", text: order.firstName },
                { type: "text", text: `${order.id}` },
                { type: "text", text: `${formatCurrency(order.price)}` },
                {
                  type: "text",
                  text: deliveryDate.toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "long",
                  }),
                },
                { type: "text", text: `${waybill}` },
              ],
            },
          ],
        },
      };

      const adminPayload = { ...payload, to: "+919448093950" };

      return Promise.all([
        fetch(
          `https://graph.facebook.com/v22.0/${process.env.WHATSAPP_PHONE_NUMBER}/messages`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `${process.env.WHATSAPP_CLOUD_API_KEY}`,
            },
            body: JSON.stringify(payload),
          },
        ),
        fetch(
          `https://graph.facebook.com/v22.0/${process.env.WHATSAPP_PHONE_NUMBER}/messages`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `${process.env.WHATSAPP_CLOUD_API_KEY}`,
            },
            body: JSON.stringify(adminPayload),
          },
        ),
      ]);
    });

    await Promise.allSettled(whatsappPromises);
  } catch (notifyError) {
    console.error("Notification failed:", notifyError);
  }

  revalidatePath("/admin/cod-orders");

  return SuccessResponse("Order Approved");
}

export async function DeleteOrder(orderId: string) {
  const session = await getServerSession(true);

  if (!session || session.user.role !== "admin") {
    return AuthorizationErrorResponse();
  }

  await db.delete(order).where(eq(order.id, orderId));

  revalidatePath("/admin/cod-orders");

  return SuccessResponse("Order Deleted");
}
