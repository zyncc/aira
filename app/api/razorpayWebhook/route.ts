import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const rzp_response = await req.json();
  const paymentId = rzp_response.payload.payment.entity.id;
  const orderId = rzp_response.payload.payment.entity.order_id;

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

  return NextResponse.json(rzp_response);
}
