"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { categoryCheck } from "@/lib/zodSchemas";
import { headers } from "next/headers";

export async function InfiniteAccountOrders(page: number) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.session) {
    throw new Error("Not authenticated");
  }
  const skip = page * 10;
  const orders = await prisma.order.findMany({
    where: {
      userId: session?.user.id as string,
    },
    skip: skip,
    take: 10,
    include: {
      address: true,
      product: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return orders;
}

export async function InfiniteProducts(page: number, category: string) {
  const validation = categoryCheck.safeParse(category);
  if (!validation.success) {
    return null;
  }
  const skip = page * 24;
  const products = await prisma.product.findMany({
    where: {
      isArchived: false,
      category: validation.data,
    },
    skip,
    take: 24,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      quantity: true,
    },
  });
  return products;
}
