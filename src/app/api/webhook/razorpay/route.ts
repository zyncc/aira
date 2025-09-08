import { db } from "@/db/instance";
import { activity, cart, order, quantity } from "@/db/schema";
import { sendOrderReceipt } from "@/functions/auth/emails/send-order-receipt";
import { formatCurrency, uuid } from "@/lib/utils";
import crypto from "crypto";
import { eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const rzp_response = await req.json();
    const paymentId = rzp_response.payload.payment.entity.id;
    const orderId = rzp_response.payload.payment.entity.order_id;
    const razorpaySignature = req.headers.get("x-razorpay-signature");

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(JSON.stringify(rzp_response))
      .digest("hex");

    if (generatedSignature !== razorpaySignature) {
      return NextResponse.json({ error: "Forbidden" }, { status: 200 });
    }

    // ✅ Update payment success for all orders
    await db
      .update(order)
      .set({ paymentId, paymentSuccess: true })
      .where(eq(order.rzpOrderId, orderId));

    const allOrders = await db.query.order.findMany({
      where: (o) => eq(o.rzpOrderId, orderId),
      with: { user: true, product: true },
    });

    const user = allOrders[0].user;
    const zipcode = allOrders[0].zipcode;
    const userId = user.id;

    // ✅ Delete user cart (single call)
    try {
      await db.delete(cart).where(eq(cart.userId, userId));
    } catch (error) {
      console.error("Error deleting user cart", error);
    }

    // ✅ Bulk quantity update (parallel)
    const quantityUpdates = allOrders.map((o) => {
      return db
        .update(quantity)
        .set({
          sm: sql`${quantity.sm} - ${o.size === "sm" ? o.quantity : 0}`,
          md: sql`${quantity.md} - ${o.size === "md" ? o.quantity : 0}`,
          lg: sql`${quantity.lg} - ${o.size === "lg" ? o.quantity : 0}`,
          xl: sql`${quantity.xl} - ${o.size === "xl" ? o.quantity : 0}`,
          doublexl: sql`${quantity.doublexl} - ${o.size === "doublexl" ? o.quantity : 0}`,
        })
        .where(eq(quantity.productId, o.productId));
    });

    // ✅ Create activity logs (parallel)
    const activityLogs = allOrders.map((o) => {
      return db.insert(activity).values({
        id: uuid(),
        type: "order",
        title: `Order Placed ${o.product.title}`,
        userId: userId,
      });
    });

    await Promise.all([...quantityUpdates, ...activityLogs]);

    // ✅ Get delivery time
    const ttdData = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/pincode?pincode=${zipcode}`,
    ).then((res) => res.json());
    const deliveryDate = new Date(
      new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
    );
    deliveryDate.setDate(deliveryDate.getDate() + ttdData.ttd + 2);

    // ✅ Aggregate product data
    const totalWeight = allOrders.reduce((acc, o) => acc + o.product.weight, 0);
    const totalHeight = allOrders.reduce((acc, o) => acc + o.product.height, 0);
    const totalLength = Math.max(...allOrders.map((order) => order.product.length));
    const totalWidth = Math.max(...allOrders.map((order) => order.product.breadth));
    const totalAmount = allOrders.reduce((acc, o) => acc + o.product.price, 0);

    console.log("Total Weight ", totalWeight);
    console.log("Total Height ", totalHeight);
    console.log("Total Length ", totalLength);
    console.log("Total Width ", totalWidth);
    console.log("Total Amount ", totalAmount);

    // ✅ Get shipping cost
    const shippingCostData = await fetch(
      `https://track.delhivery.com/api/kinko/v1/invoice/charges/.json?md=E&ss=DTO&d_pin=${zipcode}&o_pin=560078&cgm=${totalWeight}&pt=Pre-paid`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: process.env.DELHIVERY_TOKEN!,
        },
      },
    ).then((res) => res.json());

    const shippingCost = shippingCostData[0]?.total_amount;

    // ✅ Create shipment
    const shipmentData = {
      shipments: [
        {
          name: `${allOrders[0].firstName + allOrders[0].lastName || ""}`,
          order: orderId,
          phone: allOrders[0].phone,
          add: `${allOrders[0].address1}, ${allOrders[0].address2 || ""}`,
          pin: zipcode,
          payment_mode: "Prepaid",
          weight: totalWeight,
          shipment_height: totalHeight,
          shipment_length: totalLength,
          shipment_width: totalWidth,
        },
      ],
      pickup_location: { name: "mahaveer-sitara" },
    };

    const formBody = new URLSearchParams({
      format: "json",
      data: JSON.stringify(shipmentData),
    });

    const createShipment = await fetch(
      "https://track.delhivery.com/api/cmu/create.json",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
          Authorization: process.env.DELHIVERY_TOKEN!,
        },
        body: formBody,
      },
    ).then((res) => res.json());

    const waybill = createShipment.packages?.[0]?.waybill;

    console.log("WAYBILL: ", waybill);

    // ✅ Update all orders (bulk update if schema allows)
    await db
      .update(order)
      .set({
        ttd: deliveryDate,
        shipmentCost: Math.floor((shippingCost / allOrders.length) * 100) / 100,
        waybill,
      })
      .where(eq(order.rzpOrderId, orderId));

    // ✅ Send Email
    await sendOrderReceipt(
      waybill,
      user.name,
      orderId,
      allOrders,
      paymentId,
      deliveryDate,
      user.email,
    );

    // ✅ Prepare WhatsApp messages
    for (const order of allOrders) {
      await Promise.all([
        fetch(
          `https://graph.facebook.com/v22.0/${process.env.WHATSAPP_PHONE_NUMBER}/messages`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `${process.env.WHATSAPP_CLOUD_API_KEY}`,
            },
            body: JSON.stringify({
              messaging_product: "whatsapp",
              to: `+91${user.phoneNumber}`,
              type: "template",
              template: {
                name: "order_confirmed",
                language: {
                  code: "en_US",
                },
                components: [
                  {
                    type: "header",
                    parameters: [
                      {
                        type: "image",
                        image: {
                          link: `${order.product.images[0]}${"?w-3000,q-70"}`,
                        },
                      },
                    ],
                  },
                  {
                    type: "body",
                    parameters: [
                      {
                        type: "text",
                        text: order.firstName,
                      },
                      {
                        type: "text",
                        text: `${order.id}`,
                      },
                      {
                        type: "text",
                        text: `${formatCurrency(order.price)}`,
                      },
                      {
                        type: "text",
                        text: `${deliveryDate.toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "long",
                        })}`,
                      },
                      {
                        type: "text",
                        text: `${waybill}`,
                      },
                    ],
                  },
                ],
              },
            }),
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
            body: JSON.stringify({
              messaging_product: "whatsapp",
              to: "+919448093950",
              type: "template",
              template: {
                name: "order_confirmed",
                language: {
                  code: "en_US",
                },
                components: [
                  {
                    type: "header",
                    parameters: [
                      {
                        type: "image",
                        image: {
                          link: `${order.product.images[0]}${"?w-3000,q-70"}`,
                        },
                      },
                    ],
                  },
                  {
                    type: "body",
                    parameters: [
                      {
                        type: "text",
                        text: order.firstName,
                      },
                      {
                        type: "text",
                        text: `${order.id}`,
                      },
                      {
                        type: "text",
                        text: `${formatCurrency(order.price)}`,
                      },
                      {
                        type: "text",
                        text: `${deliveryDate.toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "long",
                        })}`,
                      },
                      {
                        type: "text",
                        text: `${waybill}`,
                      },
                    ],
                  },
                ],
              },
            }),
          },
        ),
      ]);
    }

    console.error("Webhook Succesful");
    return NextResponse.json({ status: "ok" }, { status: 200 });
  } catch (error) {
    console.error(error);
    console.error("Webhook Failed");
    return NextResponse.json({ status: "Webhook Failed" }, { status: 200 });
  }
}
