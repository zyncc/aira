import SidebarInsetWrapper from "@/components/sidebar/sidebar-inset-wrapper";
import { db } from "@/db/instance";
import { getServerSession } from "@/functions/auth/get-server-session";
import { redirect } from "next/navigation";
import { DataTable } from "./_components/data-table";

export default async function Page() {
  const session = await getServerSession();
  if (!session || session.user.role !== "admin") {
    return redirect(process.env.NEXT_PUBLIC_APP_URL!);
  }
  const codOrders = await db.query.order.findMany({
    where: (fields, operators) =>
      operators.and(
        operators.eq(fields.isCod, true),
        operators.eq(fields.isCodApproved, false),
      ),
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
