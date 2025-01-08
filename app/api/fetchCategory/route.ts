import prisma from "@/lib/prisma";
import {categoryCheck} from "@/lib/zodSchemas";
import {NextResponse} from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const category = url.searchParams.get("category");
  const validation = categoryCheck.safeParse(category);
  if (!validation.success) {
    throw new Error("Invalid category");
  }
  const products = await prisma.product.findMany({
    where: {
      category: validation.data,
      isArchived: false,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      quantity: true,
    },
  });
  return NextResponse.json(products);
}
