"use server";

import { getServerSession } from "@/lib/getServerSession";
import prisma from "@/lib/prisma";
import { Products } from "@/lib/types";
import { address } from "@prisma/client";

type products =
  | { productWithQuantity: Products; quantity: number; size: string }[]
  | undefined;

export async function CreateOrder(
  products: products,
  address: address,
  orderID: string,
  userId?: string
) {
  const session = await getServerSession();
  for (const product of products!) {
    let quantityAvailable = false;
    const quantities = product.productWithQuantity?.quantity;
    const requiredQuantity = product.quantity;

    switch (product.size) {
      case "sm":
        quantityAvailable = (quantities?.sm ?? 1) >= requiredQuantity;
        break;
      case "md":
        quantityAvailable = (quantities?.md ?? 1) >= requiredQuantity;
        break;
      case "lg":
        quantityAvailable = (quantities?.lg ?? 1) >= requiredQuantity;
        break;
      case "xl":
        quantityAvailable = (quantities?.xl ?? 1) >= requiredQuantity;
        break;
      default:
        console.error(`Invalid size detected: ${product.size}`);
    }
    if (!quantityAvailable) {
      await prisma.cart.delete({
        where: {
          userId: session?.user.id,
        },
      });
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
        userId: session?.user.id ?? userId!,
        productId: product.productWithQuantity.id,
        addressId: address.id,
        rzpOrderId: orderID,
      },
    });
  }
}
