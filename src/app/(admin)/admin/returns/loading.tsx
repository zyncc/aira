import SidebarInsetWrapper from "@/components/sidebar/sidebar-inset-wrapper";
import { Spinner } from "@/components/ui/spinner";

export default function Loading() {
  return (
    <SidebarInsetWrapper title="Return Requests">
      <div className={"flex h-screen w-full items-start justify-center pt-28"}>
        <Spinner className="size-10" />
      </div>
    </SidebarInsetWrapper>
  );
}
