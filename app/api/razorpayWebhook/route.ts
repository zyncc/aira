import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { nanoid } from "nanoid";

export async function POST(req: Request) {
  const rzp_response = await req.json();
  const paymentId = rzp_response.payload.payment.entity.id;
  const orderId = rzp_response.payload.payment.entity.order_id;
  const razorpaySignature = req.headers.get("x-razorpay-signature");
  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
    .update(JSON.stringify(rzp_response))
    .digest("hex");

  if (generatedSignature !== razorpaySignature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    // update order
    await prisma.order.updateMany({
      where: {
        rzpOrderId: orderId,
      },
      data: {
        paymentId,
        paymentSuccess: true,
      },
    });

    const allOrders = await prisma.order.findMany({
      where: {
        rzpOrderId: orderId,
      },
      include: {
        user: true,
        address: true,
        product: true,
      },
    });
    const userId = allOrders[0].userId;

    try {
      // delete user cart
      await prisma.cart.delete({
        where: {
          userId,
        },
      });
    } catch (error) {
      console.log("Error deleting cart");
    }

    allOrders.forEach(async (order) => {
      // update product quantity
      const updateQuantity = await prisma.quantity.update({
        where: {
          productId: order.productId,
        },
        data: {
          sm: {
            decrement: order.size == "sm" ? order.quantity : 0,
          },
          md: {
            decrement: order.size == "md" ? order.quantity : 0,
          },
          lg: {
            decrement: order.size == "lg" ? order.quantity : 0,
          },
          xl: {
            decrement: order.size == "xl" ? order.quantity : 0,
          },
          doublexl: {
            decrement: order.size == "doublexl" ? order.quantity : 0,
          },
        },
      });
      console.log(updateQuantity, "Updated Quantity");

      await prisma.activity.create({
        data: {
          userId,
          type: "order",
          title: `Order Placed ${order.product.title}`,
          id: nanoid(12),
        },
      });
    });
  } catch (error) {
    console.log(error);
  }
  return NextResponse.json({ status: "ok" }, { status: 200 });
}
