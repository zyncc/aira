import { db } from "@/db/instance";
import { activity, couponRedemptions, coupons, order, quantity, user } from "@/db/schema";
import { sendOrderReceipt } from "@/functions/auth/emails/send-order-receipt";
import { createShipment } from "@/lib/delhivery";
import { sendWhatsappMessage, uuid } from "@/lib/utils";
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
      return NextResponse.json({ error: "Forbidden" }, { status: 200 });
    }

    const rzp_response = JSON.parse(rawBody);
    const paymentId = rzp_response.payload.payment.entity.id;
    const orderId = rzp_response.payload.payment.entity.order_id; // Razorpay Order ID

    const findOrder = await db.query.order.findFirst({
      where: (o) => eq(o.orderId, orderId),
      with: {
        user: true,
        items: {
          with: { product: true },
        },
      },
    });

    if (!findOrder) {
      console.error("Order not found for ID:", orderId);
      return NextResponse.json({ error: "Order not found" }, { status: 200 });
    }

    // Check if ALREADY processed
    const alreadyProcessed = findOrder.paymentSuccess;
    if (alreadyProcessed) {
      return NextResponse.json({ info: "Already Processed" }, { status: 200 });
    }

    const totalWeight = findOrder.items.reduce((acc, o) => acc + o.product.weight, 0);
    const totalHeight = findOrder.items.reduce((acc, o) => acc + o.product.height, 0);
    const totalLength = Math.max(...findOrder.items.map((o) => o.product.length));
    const totalWidth = Math.max(...findOrder.items.map((o) => o.product.breadth));

    // create shipment
    const waybill = await createShipment(
      "Prepaid",
      findOrder,
      findOrder.id,
      totalWeight,
      totalHeight,
      totalLength,
      totalWidth,
    );

    if (!waybill) {
      console.error("Failed to generate Waybill", createShipment);
      throw new Error("Failed to generate Waybill");
    }

    await db.transaction(async (tx) => {
      if (findOrder.usedStoreCredit) {
        await tx
          .update(user)
          .set({
            storeCredit: 0,
          })
          .where(eq(user.id, findOrder.userId));
      }

      await tx
        .update(order)
        .set({
          paymentId,
          paymentSuccess: true,
          waybill,
        })
        .where(sql`${order.orderId} = ${orderId} AND ${order.paymentSuccess} = false`);

      // update stock
      for (const o of findOrder.items) {
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

      // handle coupon
      const usedCoupon = findOrder.couponCode;
      if (usedCoupon) {
        const coupon = await tx.query.coupons.findFirst({
          where: (f, o) => o.eq(f.code, usedCoupon),
          columns: { id: true },
        });

        if (coupon) {
          await tx.insert(couponRedemptions).values({
            id: uuid(),
            userId: findOrder.userId,
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
    });

    // activity logs
    try {
      await Promise.all(
        findOrder.items.map((item) =>
          db.insert(activity).values({
            id: uuid(),
            type: "order",
            title: `Order Placed ${item.product.title}`,
            userId: findOrder.userId,
          }),
        ),
      );
    } catch (error) {
      console.error("Activity log failed:", error);
    }

    try {
      await Promise.all([
        sendWhatsappMessage(findOrder.phone, findOrder),
        await sendOrderReceipt(
          waybill,
          findOrder.firstName,
          orderId,
          findOrder,
          paymentId,
          findOrder.ttd,
          findOrder.email,
        ),
      ]);
    } catch (error) {
      console.error("Notification failed:", error);
    }

    console.log("Webhook Processed Successfully");
    return NextResponse.json({ status: "ok" }, { status: 200 });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
