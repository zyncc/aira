import SidebarInsetWrapper from "@/components/sidebar/sidebar-inset-wrapper";
import { db } from "@/db/instance";
import { order } from "@/db/schema";
import { desc } from "drizzle-orm";
import { DataTable } from "./_components/data-table";

export default async function OrdersPage() {
  // await sleep(3)
  const orders = await db.query.order.findMany({
    with: {
      product: true,
      user: true,
    },
    orderBy: desc(order.createdAt),
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
