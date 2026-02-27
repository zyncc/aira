import SidebarInsetWrapper from "@/components/sidebar/sidebar-inset-wrapper";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { db } from "@/db/instance";
import { getServerSession } from "@/functions/auth/get-server-session";
import { CircleX } from "lucide-react";
import { forbidden } from "next/navigation";
import { ReturnsCard } from "./_components/return-card";

export default async function ReturnsPage() {
  const session = await getServerSession();
  if (!session || session.user.role !== "admin") {
    return forbidden();
  }
  const returns = await db.query.returns.findMany({
    with: {
      user: true,
      order: true,
      items: true,
    },
    where: (returns, o) =>
      o.or(o.eq(returns.status, "requested"), o.eq(returns.status, "approved")),
  });

  return (
    <SidebarInsetWrapper title="Return Requests">
      <div className="w-full flex-1 p-6">
        {returns.length == 0 ? (
          <div className={"mt-16 flex w-full items-center justify-center"}>
            <EmptyState />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {returns.map((ret) => (
              <ReturnsCard key={ret.id} data={ret} />
            ))}
          </div>
        )}
      </div>
    </SidebarInsetWrapper>
  );
}

function EmptyState() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <CircleX className={"text-primary"} />
        </EmptyMedia>
        <EmptyTitle>No Returns</EmptyTitle>
        <EmptyDescription>No returns or exchanges have been issued</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
