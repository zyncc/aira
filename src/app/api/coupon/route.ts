import { db } from "@/db/instance";
import { ErrorResponse, SuccessResponse } from "@/lib/api-responses";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json(ErrorResponse("Invalid Coupon"));
  }

  const getCoupon = await db.query.coupons.findFirst({
    where: (fields, operators) =>
      operators.and(operators.eq(fields.code, code), operators.eq(fields.isActive, true)),
  });

  if (
    !getCoupon ||
    !getCoupon.isActive ||
    getCoupon.expiresAt! < new Date() ||
    getCoupon.usageCount >= getCoupon.usageLimit
  ) {
    return NextResponse.json(ErrorResponse("Invalid Coupon"));
  }

  return NextResponse.json(SuccessResponse("Coupon Applied", getCoupon));
}
