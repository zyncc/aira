"use server";

import prisma from "@/lib/prisma";
import { Product } from "@prisma/client";

export async function FetchCartItems(
  cart: { id: string; size: string; quantity: number }[]
) {
  const items = await Promise.all(
    cart.map(async (item) => {
      const product = await prisma.product.findUnique({
        where: {
          id: item.id,
        },
      });

      return {
        product,
        size: item.size,
        quantity: item.quantity,
      };
    })
  );
  return items;
}
