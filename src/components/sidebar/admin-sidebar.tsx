"use client";

import {
  IconCirclePlusFilled,
  IconDashboard,
  IconListDetails,
} from "@tabler/icons-react";
import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { RotateCcw, Shirt, Star, Users } from "lucide-react";
import Link from "next/link";
import { NavUser } from "./nav-user";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: IconDashboard,
    },
    {
      title: "Orders",
      url: "/admin/orders",
      icon: IconListDetails,
    },
    {
      title: "Returns",
      url: "/admin/returns",
      icon: RotateCcw,
    },
  ],
  navClouds: [
    {
      title: "All Products",
      icon: Shirt,
      url: "/admin/products",
    },
    {
      title: "All Users",
      icon: Users,
      url: "/admin/users",
    },
    {
      title: "Reviews",
      icon: Star,
      url: "/admin/products/reviews",
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const sidebar = useSidebar();
  return (
    <Sidebar variant="inset" collapsible="icon" {...props}>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="flex flex-col gap-2">
            <SidebarMenu>
              <Link href={"/admin/products/create"}>
                <SidebarMenuItem
                  onClick={() => sidebar.isMobile && sidebar.toggleSidebar()}
                  className="flex items-center gap-2"
                >
                  <SidebarMenuButton
                    tooltip="Quick Create"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
                  >
                    <IconCirclePlusFilled />
                    <span>Create Product</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </Link>
            </SidebarMenu>
            <SidebarMenu>
              {data.navMain.map((item) => (
                <SidebarMenuItem
                  onClick={() => sidebar.isMobile && sidebar.toggleSidebar()}
                  key={item.title}
                >
                  <Link href={item.url}>
                    <SidebarMenuButton tooltip={item.title}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupContent className="flex flex-col gap-2">
            <SidebarMenu>
              {data.navClouds.map((item) => (
                <SidebarMenuItem
                  onClick={() => sidebar.isMobile && sidebar.toggleSidebar()}
                  key={item.title}
                >
                  <Link href={item.url}>
                    <SidebarMenuButton tooltip={item.title}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
