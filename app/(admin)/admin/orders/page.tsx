import prisma from "@/lib/prisma";
import OrdersPageClient from "./_client";
import SidebarInsetWrapper from "@/components/ui/sidebar-inset";

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

export const revalidate = 60;

export default async function OrdersPage() {
  const orders = await prisma.order.findMany({
    take: 11,
    include: {
      address: true,
      product: true,
      tracking: true,
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="w-full overflow-hidden">
      <SidebarInsetWrapper links={links} />
      <OrdersPageClient allOrders={orders} />
    </div>
  );
}
