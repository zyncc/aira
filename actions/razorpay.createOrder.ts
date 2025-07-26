"use server";

import { ProductsWithQuantity } from "@/lib/types";
import Razorpay from "razorpay";

type products =
  | {
      productWithQuantity: ProductsWithQuantity;
      quantity: number;
      size: string;
    }[]
  | undefined;

export async function CreateRazorpayOrder(products: products) {
  try {
    const instance = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID as string,
      key_secret: process.env.RAZORPAY_KEY_SECRET as string,
    });

    const price = products?.reduce(
      (sum, item) => sum + item.productWithQuantity.price * item.quantity,
      0
    );

    const response = await instance.orders.create({
      amount: price! * 100,
      currency: "INR",
      receipt: "receipt#1",
      notes: {
        key1: "value3",
        key2: "value2",
      },
    });

    return response.id;
  } catch (error) {
    console.log("Error creating Razorpay order:", error);
    return null;
  }
}
