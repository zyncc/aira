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
  async function deleteCart() {
    await prisma.cart.delete({
      where: {
        userId: session?.user.id,
      },
    });
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
      deleteCart();
      return {
        error: `${product.productWithQuantity.title} of Size ${
          product.size == "sm"
            ? "Small"
            : product.size == "md"
            ? "Medium"
            : product.size == "lg"
            ? "Large"
            : "XL"
        } is Out of stock`,
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
