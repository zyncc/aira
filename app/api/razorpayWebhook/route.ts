import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth.api.getSession({
    headers: headers(),
  });

  if (!session?.session) {
    return NextResponse.json(
      {
        status: "Not Authorised",
      },
      { status: 401 }
    );
  }

  const rzp_response = await req.json();
  const paymentId = rzp_response.payload.payment.entity.id;
  const orderId = rzp_response.payload.payment.entity.order_id;

  // update order
  const order = await prisma.order.updateMany({
    where: {
      rzpOrderId: orderId,
    },
    data: {
      paymentId,
      paymentSuccess: true,
    },
  });

  for (let i = 0; i <= order.count; i++) {
    const createActivity = async () => {
      await prisma.activity.create({
        data: {
          userId: session.user.id,
          title: "New Order Created",
          type: "order",
        },
      });
    };
    createActivity();
  }

  return NextResponse.json(rzp_response);
}
