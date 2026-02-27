import SidebarInsetWrapper from "@/components/sidebar/sidebar-inset-wrapper";
import { db } from "@/db/instance";
import { getServerSession } from "@/functions/auth/get-server-session";
import { forbidden } from "next/navigation";
import { CouponsTable } from "./_components/coupons-table";

export default async function Page() {
  const session = await getServerSession();
  if (!session || session.user.role !== "admin") {
    return forbidden();
  }
  const coupons = await db.query.coupons.findMany();
  return (
    <SidebarInsetWrapper title="Coupons">
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 md:gap-6">
            <div className="p-6">
              <CouponsTable coupons={coupons} />
            </div>
          </div>
        </div>
      </div>
    </SidebarInsetWrapper>
  );
}
