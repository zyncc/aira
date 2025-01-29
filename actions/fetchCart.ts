"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

export async function fetchCart() {
  const session = await auth.api.getSession({
    headers: headers(),
  });
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
