import { auth } from "@/auth";
import SidebarInsetWrapper from "@/components/ui/sidebar-inset";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const links = [
  {
    label: "Home",
    href: "/admin",
  },
];

export default async function AdminPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (session?.user.role !== "admin") {
    redirect("/");
  }
  return (
    <div className="w-full">
      <SidebarInsetWrapper links={links} />
      <div className="flex w-full flex-1 flex-col gap-4 p-4 pt-0">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <div className="aspect-video rounded-xl bg-muted/50" />
          <div className="aspect-video rounded-xl bg-muted/50" />
          <div className="aspect-video rounded-xl bg-muted/50" />
        </div>
        <div className="min-h-[100vh] w-full flex-1 rounded-xl bg-muted/50" />
      </div>
    </div>
  );
}
