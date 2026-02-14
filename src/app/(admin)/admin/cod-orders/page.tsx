import SidebarInsetWrapper from "@/components/sidebar/sidebar-inset-wrapper";
import { db } from "@/db/instance";
import { DataTable } from "./_components/data-table";

export default async function Page() {
  const codOrders = await db.query.order.findMany({
    where: (fields, operators) =>
      operators.and(
        operators.eq(fields.isCod, true),
        operators.eq(fields.isCodApproved, false),
      ),
    with: {
      product: true,
      user: true,
    },
    orderBy: (fields, operators) => operators.asc(fields.createdAt),
  });
  return (
    <SidebarInsetWrapper title="COD Orders">
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 md:gap-6">
            <div className="p-6">
              <DataTable data={codOrders} />
            </div>
          </div>
        </div>
      </div>
    </SidebarInsetWrapper>
  );
}
