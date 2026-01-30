import SidebarInsetWrapper from "@/components/sidebar/sidebar-inset-wrapper";
import { db } from "@/db/instance";
import { order } from "@/db/schema";
import { desc } from "drizzle-orm";
import OrdersPageClient from "./_components/_client";

export default async function OrdersPage() {
  // await sleep(3)
  const orders = await db.query.order.findMany({
    limit: 11,
    with: {
      product: true,
      user: true,
    },
    orderBy: desc(order.createdAt),
  });

  return (
    <SidebarInsetWrapper title="All Orders">
      <div className="w-full flex-1 p-6">
        <OrdersPageClient allOrders={orders} />
      </div>
    </SidebarInsetWrapper>
  );
}
