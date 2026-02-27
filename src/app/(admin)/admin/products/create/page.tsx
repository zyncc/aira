import SidebarInsetWrapper from "@/components/sidebar/sidebar-inset-wrapper";
import { Spinner } from "@/components/ui/spinner";
import { getServerSession } from "@/functions/auth/get-server-session";
import { forbidden } from "next/navigation";
import { Suspense } from "react";
import CreateProductForm from "./_components/CreateProductForm";

export default async function CreateProduct() {
  return (
    <Suspense
      fallback={
        <div className="flex h-full w-full items-center justify-center">
          <Spinner />
        </div>
      }
    >
      <SuspenseWrapper />
    </Suspense>
  );
}

async function SuspenseWrapper() {
  const session = await getServerSession();
  if (!session || session.user.role !== "admin") {
    return forbidden();
  }
  return (
    <SidebarInsetWrapper title="Create Product">
      <div className="flex flex-1 flex-col gap-4 p-6">
        <CreateProductForm />
      </div>
    </SidebarInsetWrapper>
  );
}
