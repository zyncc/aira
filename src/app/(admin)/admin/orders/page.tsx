import SidebarInsetWrapper from "@/components/ui/sidebar-inset";
import { db } from "@/db/instance";
import { order } from "@/db/schema";
import { desc } from "drizzle-orm";
import OrdersPageClient from "./_components/_client";

const links = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Orders",
    href: "/admin/orders",
  },
];

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
    <div className="w-full overflow-hidden">
      <SidebarInsetWrapper links={links} />
      <OrdersPageClient allOrders={orders} />
    </div>
  );
}
