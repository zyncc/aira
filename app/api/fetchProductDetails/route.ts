import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id") as string;

    const product = await prisma.product.findUnique({
        where: {
            id,
            isArchived: false,
        },
        include: {
            quantity: true,
            order: {
                where: {
                    productId: id,
                    paymentSuccess: true,
                },
                select: {
                    id: true,
                },
            },
            reviews: {
                select: {
                    id: true,
                },
            },
        },
    });
    return NextResponse.json(product);
}