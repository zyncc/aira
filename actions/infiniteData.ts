"use server";

import getSession from "@/lib/getSession";
import prisma from "@/lib/prisma";

export async function InfiniteAccountOrders(page: number) {
  const session = await getSession();
  if (!session?.user) {
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

export async function InfiniteProducts(page: number) {
  const skip = page * 24;
  const products = await prisma.product.findMany({
    where: {
      isArchived: false,
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
