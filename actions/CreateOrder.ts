"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { Products } from "@/lib/types";
import { address } from "@prisma/client";
import { headers } from "next/headers";

type products =
  | { productWithQuantity: Products; quantity: number; size: string }[]
  | undefined;

export async function CreateOrder(
  products: products,
  address: address,
  orderID: string
) {
  const session = await auth.api.getSession({
    headers: headers(),
  });
  if (!session?.session) {
    return null;
  }
  for (const product of products!) {
    let quantityAvailable = true;
    if (product.size === "sm") {
      quantityAvailable =
        product.productWithQuantity.quantity?.sm! > product.quantity;
    } else if (product.size === "md") {
      quantityAvailable =
        product.productWithQuantity.quantity?.md! > product.quantity;
    } else if (product.size === "lg") {
      quantityAvailable =
        product.productWithQuantity.quantity?.lg! > product.quantity;
    } else if (product.size === "xl") {
      quantityAvailable =
        product.productWithQuantity.quantity?.xl! > product.quantity;
    }
    if (quantityAvailable == false) {
      return {
        error: `${product.productWithQuantity.title} of ${product.size} and quantity is Out of stock`,
      };
    }
    await prisma.order.create({
      data: {
        paymentSuccess: false,
        price: product.productWithQuantity.price,
        quantity: product.quantity,
        size: product.size,
        userId: session.user.id,
        productId: product.productWithQuantity.id,
        addressId: address.id,
        rzpOrderId: orderID,
      },
    });
  }
}
