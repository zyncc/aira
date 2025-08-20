import { db } from "@/db/instance";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id") as string;

  const quantity = await db.query.quantity.findFirst({
    where: (quantity, operator) => operator.eq(quantity.productId, id),
  });
  return NextResponse.json(quantity);
}
