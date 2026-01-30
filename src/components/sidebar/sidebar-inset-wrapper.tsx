import React from "react";
import { SiteHeader } from "../site-header";
import { SidebarInset } from "../ui/sidebar";

export default function SidebarInsetWrapper({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <SidebarInset>
      <SiteHeader title={title} />
      {children}
    </SidebarInset>
  );
}
