import prisma from "@/lib/prisma";
import { getServerSession } from "@/lib/getServerSession";
import OrdersPage from "@/components/ordersPage";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await getServerSession();

  if (!session) {
    return redirect("/signin?callbackUrl=/account/orders");
  }

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
