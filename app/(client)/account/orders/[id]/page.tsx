import formatCurrency from "@/lib/formatCurrency";
import prisma from "@/lib/prisma";
import Image from "next/image";
import {notFound} from "next/navigation";
import React from "react";

export const revalidate = 0;

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;
  const order = await prisma.order.findUnique({
    where: {
      id,
    },
    include: {
      product: true,
      address: true,
    },
  });
  if (!order) {
    return notFound();
  }
  return (
    <div className="container mt-10">
      <Image
        src={order.image}
        alt="Product Image"
        height={300}
        width={300}
        priority
        className="object-cover rounded-lg aspect-square"
      />
      <h1 className="font-medium text-lg">{order.product.title}</h1>
      <h1 className="font-medium text-lg">
        {formatCurrency(order.price * order.quantity).split(".")[0]}
      </h1>
    </div>
  );
}
