import { db } from "@/db/instance";
import { getServerSession } from "@/functions/auth/get-server-session";
import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json([]);
  }
  try {
    const cart = await db.query.cart.findFirst({
      where: (cart) => eq(cart.userId, session.user.id),
      with: {
        items: {
          orderBy: (item) => desc(item.createdAt),
          with: {
            product: {
              with: {
                quantity: true,
              },
            },
          },
        },
      },
    });

    if (!cart) {
      return NextResponse.json([]);
    }

    const data = cart.items.map((item) => ({
      id: item.id,
      product: item.product,
      size: item.size,
      quantity: item.quantity,
    }));

    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to get cart", error);
    return NextResponse.json([]);
  }
}
