"use server";

import { getServerSession } from "@/lib/getServerSession";
import prisma from "@/lib/prisma";

export async function fetchCart() {
  const session = await getServerSession();
  if (!session?.session) {
    return null;
  }

  const cartItems = await prisma.cart.findUnique({
    where: {
      userId: session?.user.id,
    },
    include: {
      items: {
        include: {
          product: {
            include: {
              quantity: true,
            },
          },
        },
      },
    },
  });
  return cartItems;
}
