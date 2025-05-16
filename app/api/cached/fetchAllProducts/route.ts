import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const products = await prisma.product.findMany({
    where: {
      isArchived: false,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      quantity: true,
    },
    take: 12,
  });
  return NextResponse.json(products, { status: 200 });
}
