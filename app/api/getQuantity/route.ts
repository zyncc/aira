import prisma from "@/lib/prisma";
import {NextRequest, NextResponse} from "next/server";

export async function GET(req: NextRequest) {
  const productId = new URL(req.url).searchParams.get("productId");
  if (!productId) throw new Error("Product ID is required");

  const quantity = await prisma.product.findUnique({
    where: {
      id: productId,
    },
    include: {
      quantity: true,
    },
  });

  return NextResponse.json(quantity);
}
