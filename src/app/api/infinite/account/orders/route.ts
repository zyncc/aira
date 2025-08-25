import { db } from "@/db/instance";
import { getServerSession } from "@/functions/auth/get-server-session";
import { NextResponse } from "next/server";

const PAGE_SIZE = 10;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url!);
  const page = parseInt(searchParams.get("page")!);

  const session = await getServerSession();

  if (!session) {
    throw new Error("No Authenticated");
  }

  const skip = (page - 1) * PAGE_SIZE;
  const orders = await db.query.order.findMany({
    where: (order, o) => o.eq(order.userId, session.user.id),
    with: {
      product: true,
      address: true,
    },
    orderBy: (order, o) => o.desc(order.createdAt),
    offset: skip,
    limit: PAGE_SIZE,
  });

  return NextResponse.json({
    orders,
    nextPage: orders.length === PAGE_SIZE ? page + 1 : undefined,
  });
}
