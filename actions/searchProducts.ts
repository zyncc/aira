"use server";

import prisma from "@/lib/prisma";

export async function Search(query: string) {
  const products = await prisma.product.findMany({
    take: 5,
    select: {
      title: true,
      category: true,
      images: true,
      price: true,
      id: true,
      isArchived: false,
    },
    where: {
      OR: [
        {
          title: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          category: {
            contains: query,
            mode: "insensitive",
          },
        },
      ],
    },
  });
  console.log(products);
  return { products };
}
