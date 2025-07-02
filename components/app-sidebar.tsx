"use client";

import { LayoutDashboard, Shirt, Users } from "lucide-react";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";

const data = [
  {
    title: "Dashboard",
    url: "#",
    icon: LayoutDashboard,
    items: [
      {
        title: "Home",
        url: "/admin",
      },
      {
        title: "Statistics",
        url: "/admin/graphs",
      },
    ],
  },
  {
    title: "Products",
    url: "#",
    icon: Shirt,
    items: [
      {
        title: "All Products",
        url: "/admin/products",
      },
      {
        title: "Create Product",
        url: "/admin/products/create",
      },
    ],
  },
  {
    title: "Users",
    icon: Users,
    url: "#",
    items: [
      {
        title: "All Users",
        url: "/admin/users",
      },
    ],
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const sidebar = useSidebar();
  const isMobile = sidebar.isMobile;
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarContent className="bg-background">
        {data.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel className="flex items-center justify-start gap-x-1">
              <group.icon />
              {group.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem
                    key={item.title}
                    onClick={() => (isMobile ? sidebar.toggleSidebar() : null)}
                  >
                    <SidebarMenuButton asChild>
                      <Link href={item.url}>{item.title}</Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="bg-background">
        <NavUser />
      </SidebarFooter>
      {/* <SidebarRail /> */}
    </Sidebar>
  );
}
