import SidebarInsetWrapper from "@/components/sidebar/sidebar-inset-wrapper";
import { db } from "@/db/instance";
import { DataTable } from "./_components/data-table";

export default async function OrdersPage() {
  // await sleep(3)
  const orders = await db.query.order.findMany({
    where: (f, o) => o.eq(f.isCodApproved, true),
    orderBy: (order, o) => o.desc(order.createdAt),
    with: {
      user: true,
      items: {
        with: {
          product: true,
        },
      },
    },
  });

  return (
    <SidebarInsetWrapper title="All Orders">
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div>
            <DataTable data={orders} />
          </div>
        </div>
      </div>
    </SidebarInsetWrapper>
  );
}
