import { db } from "@/db/instance";
import { getServerSession } from "@/functions/auth/get-server-session";
import { redirect } from "next/navigation";
import OrdersPage from "./_components/orders-page";

export default async function Page() {
  const session = await getServerSession();

  if (!session) {
    return redirect("/signin?callbackUrl=/account/orders");
  }

  const orders = await db.query.order.findMany({
    where: (order, o) => o.eq(order.userId, session.user.id),
    with: {
      product: true,
      address: true,
    },
    orderBy: (order, o) => o.desc(order.createdAt),
    limit: 10,
  });

  return <OrdersPage orders={orders} session={session} />;
}
