import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { validateWebhookSignature } from "razorpay/dist/utils/razorpay-utils";

export async function POST(req: Request) {
  const rzp_response = await req.json();
  const paymentId = rzp_response.payload.payment.entity.id;
  const orderId = rzp_response.payload.payment.entity.order_id;
  const razorpaySignature = req.headers.get("x-razorpay-signature");

  const validSignature = validateWebhookSignature(
    JSON.stringify(req.body),
    razorpaySignature!,
    process.env.RAZORPAY_WEBHOOK_SECRET!
  );

  if (!validSignature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

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

  // for (let i = 0; i <= order.count; i++) {
  //   const createActivity = async () => {
  //     await prisma.activity.create({
  //       data: {
  //         userId: session?.user.id!,
  //         title: "New Order Created",
  //         type: "order",
  //       },
  //     });
  //   };
  //   createActivity();
  // }

  return NextResponse.json(rzp_response, { status: 200 });
}
