import prisma from "@/lib/prisma";
import {NextResponse} from "next/server";

const PAGE_SIZE = 10;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url!);
  const page = parseInt(searchParams.get("page")!);
  const userId = searchParams.get("userId") as string;

  if (!userId) {
    throw new Error("No user id provided");
  }

  const skip = (page - 1) * PAGE_SIZE;
  const orders = await prisma.order.findMany({
    where: {
      userId,
    },
    include: {
      product: true,
      address: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    skip,
    take: PAGE_SIZE,
  });

  return NextResponse.json({
    orders,
    nextPage: orders.length === PAGE_SIZE ? page + 1 : undefined,
  });
}
