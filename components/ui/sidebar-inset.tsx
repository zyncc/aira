"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import Link from "next/link";
import { Button } from "./button";
import { RefreshCcw } from "lucide-react";
import { usePathname } from "next/navigation";
import { invalidateCache } from "@/actions/invalidateCache";

export default function SidebarInsetWrapper({
  links,
}: {
  links: { label: string; href: string }[];
}) {
  const pathName = usePathname();
  return (
    <SidebarInset>
      <header className="flex justify-between pr-4 h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              {links.map((crumb, index) => {
                const isLast = index === links.length - 1;
                return (
                  <div key={crumb.href} className="flex items-center">
                    <BreadcrumbItem>
                      <Link href={crumb.href}>{crumb.label}</Link>
                    </BreadcrumbItem>
                    {!isLast && <BreadcrumbSeparator />}
                  </div>
                );
              })}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <Button
          variant={"outline"}
          onClick={async () => {
            await invalidateCache(pathName);
            window.location.reload();
          }}
        >
          <RefreshCcw />
          <span className="hidden lg:block">Refresh Cache</span>
        </Button>
      </header>
    </SidebarInset>
  );
}
