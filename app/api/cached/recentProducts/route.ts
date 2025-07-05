import prisma from "@/lib/prisma";
import {NextResponse} from "next/server";

export async function GET() {
  const products = await prisma.product.findMany({
    where: {
      isFeatured: false,
      isArchived: false,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
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
