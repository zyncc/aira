import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { response } = await req.json();

  const decodedResponse = Buffer.from(response, "base64").toString("utf-8");

  const parsedResponse = JSON.parse(decodedResponse);

  if (parsedResponse.success) {
    await prisma.order.updateMany({
      where: {
        transactionId: parsedResponse.data.merchantTransactionId,
      },
      data: {
        paymentSuccess: true,
      },
    });
    try {
      const find = await prisma.order.findMany({
        where: {
          transactionId: parsedResponse.data.merchantTransactionId,
          paymentSuccess: true,
        },
        select: {
          productId: true,
          size: true,
          quantity: true,
          userId: true,
        },
      });
      try {
        await prisma.cart.delete({
          where: {
            userId: find[0].userId,
          },
        });
      } catch (error) {
        console.log("FAILED!");
      }
      find.map(async (item) => {
        if (item.size == "sm") {
          await prisma.quantity.update({
            where: {
              productId: item.productId,
            },
            data: {
              sm: {
                decrement: item.quantity,
              },
            },
          });
        } else if (item.size == "md") {
          await prisma.quantity.update({
            where: {
              productId: item.productId,
            },
            data: {
              md: {
                decrement: item.quantity,
              },
            },
          });
        } else if (item.size == "lg") {
          await prisma.quantity.update({
            where: {
              productId: item.productId,
            },
            data: {
              lg: {
                decrement: item.quantity,
              },
            },
          });
        } else {
          await prisma.quantity.update({
            where: {
              productId: item.productId,
            },
            data: {
              xl: {
                decrement: item.quantity,
              },
            },
          });
        }
      });
      await prisma.order.updateMany({
        where: {
          transactionId: parsedResponse.data.merchantTransactionId,
        },
        data: {
          updatedProductQuantity: true,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }
  return NextResponse.json({ message: "Success" }, { status: 200 });
}
