import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Home, Users, AreaChartIcon, Shirt, LogOut } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";

const Group1 = [
  {
    title: "Home",
    url: "/admin",
    icon: Home,
  },
  {
    title: "Graphs",
    url: "#",
    icon: AreaChartIcon,
  },
];

const Group2 = [
  {
    title: "Users",
    url: "/admin/users",
    icon: Users,
  },
  {
    title: "Products",
    url: "/admin/products",
    icon: Shirt,
  },
];
export default function AdminSidebar() {
  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {Group1.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link replace href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarSeparator />
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {Group2.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link replace href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Link href={"/"}>
          <Button className="w-full" variant={"destructive"}>
            <LogOut className="mr-2 h-4 w-4" />
            Exit
          </Button>
        </Link>
      </SidebarFooter>
    </Sidebar>
  );
}
