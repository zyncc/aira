import prisma from "@/lib/prisma";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const cursor = request.nextUrl.searchParams.get("cursor") || undefined;

  const orders = await prisma.order.findMany({
    take: 11,
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: cursor } : undefined,
    include: {
      address: true,
      product: true,
      tracking: true,
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const nextCursor = orders.length === 11 ? orders[orders.length - 1].id : null;

  return NextResponse.json({
    orders,
    nextCursor,
  });
}
