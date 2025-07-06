import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const phoneNumber = request.nextUrl.searchParams.get("phoneNumber");
  if (!phoneNumber) {
    return NextResponse.json(false, { status: 400 });
  }
  const userExists = await prisma.user.findUnique({
    where: {
      phoneNumber,
    },
  });
  return NextResponse.json(!!userExists);
}
