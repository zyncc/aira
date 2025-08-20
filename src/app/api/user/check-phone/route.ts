import { db } from "@/db/instance";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const phoneNumber = request.nextUrl.searchParams.get("phoneNumber");
  if (!phoneNumber) {
    return NextResponse.json(false, { status: 400 });
  }
  const userExists = await db.query.user.findFirst({
    where: (user) => eq(user.phoneNumber, phoneNumber),
    columns: {
      id: true,
    },
  });
  return NextResponse.json(!!userExists);
}
