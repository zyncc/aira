import {getServerSession} from "@/lib/getServerSession";
import prisma from "@/lib/prisma";
import {NextResponse} from "next/server";

export async function GET(req: Request) {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return NextResponse.json([]);
  }
  try {
    const cart = await prisma.cart.findUnique({
      where: {
        userId: session.user.id,
      },
      include: {
        items: {
          include: {
            product: {
              include: {
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
