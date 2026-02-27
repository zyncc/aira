import SidebarInsetWrapper from "@/components/sidebar/sidebar-inset-wrapper";
import { getServerSession } from "@/functions/auth/get-server-session";
import { redirect } from "next/navigation";
import CreateProductForm from "./_components/CreateProductForm";

export default async function CreateProduct() {
  const session = await getServerSession();
  if (!session || session.user.role !== "admin") {
    return redirect(process.env.NEXT_PUBLIC_APP_URL!);
  }
  return (
    <SidebarInsetWrapper title="Create Product">
      <div className="flex flex-1 flex-col gap-4 p-6">
        <CreateProductForm />
      </div>
    </SidebarInsetWrapper>
  );
}
