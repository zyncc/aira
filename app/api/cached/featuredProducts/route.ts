import prisma from "@/lib/prisma";
import {NextResponse} from "next/server";

export async function GET() {
  const products = await prisma.product.findMany({
    where: {
      isFeatured: true,
      isArchived: false,
    },
    take: 10,
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      title: true,
      price: true,
      images: true,
      placeholderImages: true,
      category: true,
    },
  });
  return NextResponse.json(products, { status: 200 });
}
