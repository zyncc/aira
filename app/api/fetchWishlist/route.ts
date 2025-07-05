import {getServerSession} from "@/lib/getServerSession";
import prisma from "@/lib/prisma";
import {NextResponse} from "next/server";

export async function GET() {
  const session = await getServerSession();
  if (!session?.user) {
    return NextResponse.json({ items: [] });
  }

  const wishlist = await prisma.wishlist.findUnique({
    where: {
      userId: session.user.id,
    },
    select: {
      items: {
        select: {
          id: true,
          product: {
            select: {
              id: true,
              images: true,
              title: true,
              price: true,
            },
          },
        },
      },
    },
  });

  return NextResponse.json({ items: wishlist?.items || [] });
}
