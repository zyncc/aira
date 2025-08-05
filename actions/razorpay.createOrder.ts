"use server";

import prisma from "@/lib/prisma";
import Razorpay from "razorpay";

type products =
  | {
      id: string;
      quantity: number;
    }[]
  | undefined;

export async function CreateRazorpayOrder(products: products) {
  try {
    const instance = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID as string,
      key_secret: process.env.RAZORPAY_KEY_SECRET as string,
    });

    if (!products || products.length === 0) {
      return null;
    }

    const ids = products.map((item) => item.id);

    const productList = await prisma.product.findMany({
      where: {
        id: { in: ids },
      },
      select: {
        id: true,
        price: true,
      },
    });

    const price = productList.reduce((sum, product) => {
      const match = products.find((p) => p.id === product.id);
      const quantity = match?.quantity ?? 1;
      return sum + product.price * quantity;
    }, 0);

    const response = await instance.orders.create({
      amount: price! * 100,
      currency: "INR",
      receipt: "receipt#1",
    });

    return response.id;
  } catch (error) {
    console.log("Error creating Razorpay order:", error);
    return null;
  }
}
