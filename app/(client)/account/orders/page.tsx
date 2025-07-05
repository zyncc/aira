import React from "react";

import prisma from "@/lib/prisma";
import {getServerSession} from "@/lib/getServerSession";
import OrdersPage from "@/components/ordersPage";
import {redirect} from "next/navigation";

export default async function Page() {
  const session = await getServerSession();
  if (!session) {
    return  redirect("/signin?callbackUrl=/account/orders")
  }

  // await new Promise<void>(
  //   (resolve) =>
  //     setTimeout(() => {
  //       resolve();
  //     }, 3000) // Simulates a 3-second delay
  // );

  const orders = await prisma.order.findMany({
    where: {
      userId: session?.user.id,
    },
    include: {
      product: true,
      address: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
  });

  return <OrdersPage orders={orders} session={session} />;
}
