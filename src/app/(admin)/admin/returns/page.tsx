import SidebarInsetWrapper from "@/components/ui/sidebar-inset";
import { db } from "@/db/instance";
import { ReturnsCard } from "./_components/return-card";

const links = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Returns",
    href: "/admin/returns",
  },
];

export const dynamic = "force-dynamic";

export default async function ReturnsPage() {
  const returns = await db.query.returns.findMany({
    with: {
      user: true,
      order: true,
    },
    where: (returns, o) =>
      o.and(
        o.isNull(returns.finalApproved),
        o.or(o.eq(returns.approved, true), o.isNull(returns.approved)),
      ),
  });

  return (
    <div className="w-full overflow-hidden">
      <SidebarInsetWrapper links={links} />
      <div className="w-full flex-1 p-4 pt-0">
        {returns.length == 0 ? (
          <div>No Returns Found</div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {returns.map((ret) => (
              <ReturnsCard key={ret.id} data={ret} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
