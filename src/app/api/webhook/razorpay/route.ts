import { db } from "@/db/instance";
import { activity, cart, couponRedemptions, coupons, order, quantity } from "@/db/schema";
import { sendOrderReceipt } from "@/functions/auth/emails/send-order-receipt";
import { formatCurrency, uuid } from "@/lib/utils";
import crypto from "crypto";
import { eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const razorpaySignature = req.headers.get("x-razorpay-signature");

    if (!razorpaySignature) {
      return NextResponse.json({ error: "Missing Signature" }, { status: 400 });
    }

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(rawBody)
      .digest("hex");

    if (
      !crypto.timingSafeEqual(
        Buffer.from(generatedSignature),
        Buffer.from(razorpaySignature),
      )
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 401 });
    }

    const rzp_response = JSON.parse(rawBody);
    const paymentId = rzp_response.payload.payment.entity.id;
    const orderId = rzp_response.payload.payment.entity.order_id; // Razorpay Order ID

    // 1. Idempotency Check & Data Fetch
    const allOrders = await db.query.order.findMany({
      where: (o) => eq(o.rzpOrderId, orderId),
      with: { user: true, product: true },
    });

    if (allOrders.length === 0) {
      console.error("Order not found for ID:", orderId);
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Check if ALREADY processed (any of them is success)
    const alreadyProcessed = allOrders.some((o) => o.paymentSuccess);
    if (alreadyProcessed) {
      return NextResponse.json({ info: "Already Processed" }, { status: 200 });
    }

    const user = allOrders[0].user;
    const zipcode = allOrders[0].zipcode;
    const userId = user.id;

    // 2. External API: Delhivery (Shipment Creation)
    // We do this BEFORE DB commit. If this fails, we return 500, Razorpay retries.
    // This prevents "Paid but no Waybill" state.

    // Get delivery time
    const ttdData = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/pincode?pincode=${zipcode}`,
    ).then((res) => res.json());

    const deliveryDate = new Date(
      new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
    );
    if (ttdData?.ttd) {
      deliveryDate.setDate(deliveryDate.getDate() + ttdData.ttd + 2);
    }

    // Aggregate product data
    const totalWeight = allOrders.reduce((acc, o) => acc + o.product.weight, 0);
    const totalHeight = allOrders.reduce((acc, o) => acc + o.product.height, 0);
    const totalLength = Math.max(...allOrders.map((order) => order.product.length));
    const totalWidth = Math.max(...allOrders.map((order) => order.product.breadth));
    // Calculate Total Amount from actual products to ensure data consistency

    // Get shipping cost
    let shippingCost = 0;
    try {
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
      shippingCost = shippingCostData[0].total_amount || 0;
    } catch (e) {
      console.error("Failed to fetch shipping cost", e);
      // Proceeding with 0 cost is better than failing the whole order, or should we fail?
      // For now, logging error but proceeding.
    }

    // Create Shipment
    const shipmentData = {
      shipments: [
        {
          name: `${allOrders[0].firstName + " " + allOrders[0].lastName || ""}`,
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
      pickup_location: { name: "mahaveer-sitara-d-block" },
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

    if (!waybill) {
      console.error("Failed to generate Waybill", createShipment);
      // Critical error: We can't ship without waybill.
      // Return 500 so Razorpay retries later (maybe temp API issue).
      throw new Error("Failed to generate Waybill");
    }

    console.log("WAYBILL: ", waybill);

    // 3. Database Transaction (Atomic Commit)
    await db.transaction(async (tx) => {
      // A. Mark Orders as Paid & Set Waybill
      // Atomic Update: Only update if still pending
      const updateResult = await tx
        .update(order)
        .set({
          paymentId,
          paymentSuccess: true,
          ttd: deliveryDate,
          shipmentCost: Math.floor((shippingCost / allOrders.length) * 100) / 100,
          waybill,
        })
        .where(sql`${order.rzpOrderId} = ${orderId} AND ${order.paymentSuccess} = false`)
        .returning({ id: order.id });

      if (updateResult.length === 0) {
        console.warn(
          "Transaction validation failed: Orders already processed or missing.",
        );
        return;
      }

      // B. Delete user cart
      await tx.delete(cart).where(eq(cart.userId, userId));

      // C. Update Stock
      for (const o of allOrders) {
        await tx
          .update(quantity)
          .set({
            sm: sql`${quantity.sm} - ${o.size === "sm" ? o.quantity : 0}`,
            md: sql`${quantity.md} - ${o.size === "md" ? o.quantity : 0}`,
            lg: sql`${quantity.lg} - ${o.size === "lg" ? o.quantity : 0}`,
            xl: sql`${quantity.xl} - ${o.size === "xl" ? o.quantity : 0}`,
            doublexl: sql`${quantity.doublexl} - ${o.size === "doublexl" ? o.quantity : 0}`,
          })
          .where(eq(quantity.productId, o.productId));
      }

      // D. Coupon Logic
      const usedCoupon = allOrders[0].couponCode;
      if (usedCoupon) {
        const coupon = await tx.query.coupons.findFirst({
          where: (f, o) => o.eq(f.code, usedCoupon),
          columns: { id: true },
        });

        if (coupon) {
          await tx.insert(couponRedemptions).values({
            id: uuid(),
            userId,
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

      // E. Activity Logs
      for (const o of allOrders) {
        await tx.insert(activity).values({
          id: uuid(),
          type: "order",
          title: `Order Placed ${o.product.title}`,
          userId: userId,
        });
      }
    });

    // 4. Notifications (Fire & Forget, or independent await)
    // We do this AFTER transaction commits. If this fails, order is still safe.
    try {
      // Send Email
      await sendOrderReceipt(
        waybill,
        user.name,
        orderId,
        allOrders,
        paymentId,
        deliveryDate,
        user.email,
      );

      // Send WhatsApp messages
      const whatsappPromises = allOrders.map((order) => {
        const payload = {
          messaging_product: "whatsapp",
          to: `+91${allOrders[0].phone}`, // Assuming same phone for all? Or user phone
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
      // Do not fail the webhook, order is processed.
    }

    console.log("Webhook Processed Successfully");
    return NextResponse.json({ status: "ok" }, { status: 200 });
  } catch (error) {
    console.error("Webhook processing error:", error);
    // Return 500 to signal retry for retryable errors?
    // If it's a logic error, 500 might cause infinite retries.
    // For now, if we threw explicitly (e.g. Waybill failed), we want retry.
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
