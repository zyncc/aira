import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

const PAGE_SIZE = 10;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url!);
  const page = parseInt(searchParams.get("page")!);
  const id = searchParams.get("productId");

  if (!id) {
    throw new Error("No product id provided");
  }

  const skip = (page - 1) * PAGE_SIZE;
  const review = await prisma.reviews.findMany({
    where: {
      productId: id,
    },
    include: {
      user: {
        select: {
          id: true,
          image: true,
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 1,
    skip,
  });

  return NextResponse.json({
    review,
    nextPage: review.length === PAGE_SIZE ? page + 1 : undefined,
  });
}
