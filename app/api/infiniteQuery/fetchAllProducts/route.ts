import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

const PAGE_SIZE = 12;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url!);
  const page = parseInt(searchParams.get("page")!);

  const skip = (page - 1) * PAGE_SIZE;
  const products = await prisma.product.findMany({
    where: {
      isArchived: false,
    },
    orderBy: {
      listOrder: "asc",
    },
    include: {
      quantity: true,
    },
    skip,
    take: PAGE_SIZE,
  });

  return NextResponse.json({
    products,
    nextPage: products.length === PAGE_SIZE ? page + 1 : undefined,
  });
}
