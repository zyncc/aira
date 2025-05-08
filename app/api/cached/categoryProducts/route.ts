import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const category = url.searchParams.get("category");
  if (!category) {
    return NextResponse.json(
      { error: "Category is required" },
      { status: 400 }
    );
  }
  console.log("Fetching products for category:", category);
  const products = await prisma.product.findMany({
    where: {
      category,
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
