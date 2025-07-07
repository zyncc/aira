"use client";

import type React from "react";

import {
  LayoutDashboard,
  Shirt,
  Users,
  Home,
  BarChart3,
  ShoppingCart,
  Settings,
  TrendingUp,
  FileText,
  Package,
  Plus,
  FolderOpen,
  Star,
  UserCheck,
  Shield,
  Activity,
  WarehouseIcon as Inventory,
  Tags,
} from "lucide-react";
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
        icon: Home,
      },
      {
        title: "Statistics",
        url: "/admin/graphs",
        icon: BarChart3,
      },
      {
        title: "Orders",
        url: "/admin/orders",
        icon: ShoppingCart,
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
        icon: Package,
      },
      {
        title: "Create Product",
        url: "/admin/products/create",
        icon: Plus,
      },
      {
        title: "Inventory",
        url: "/admin/products/inventory",
        icon: Inventory,
      },
      {
        title: "Reviews",
        url: "/admin/products/reviews",
        icon: Star,
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
        icon: Users,
      },
    ],
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const sidebar = useSidebar();
  const isMobile = sidebar.isMobile;

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent className="bg-background">
        {data.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel className="flex items-center justify-start gap-x-2">
              <group.icon className="h-4 w-4" />
              <span className="group-data-[collapsible=icon]:hidden">
                {group.title}
              </span>
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem
                    key={item.title}
                    onClick={() => (isMobile ? sidebar.toggleSidebar() : null)}
                  >
                    <SidebarMenuButton asChild tooltip={item.title}>
                      <Link href={item.url} className="flex items-center gap-2">
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
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
    </Sidebar>
  );
}
