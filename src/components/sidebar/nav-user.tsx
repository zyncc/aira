"use client";

import { authClient } from "@/auth/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  Laptop,
  LogOut,
  Moon,
  Sun,
  SunMoonIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";

export function NavUser() {
  const { isMobile } = useSidebar();
  const { data: session } = authClient.useSession();
  const { setTheme } = useTheme();
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={session?.user.image ?? ""} alt={session?.user.name} />
                <AvatarFallback className="rounded-lg">
                  {session?.user.name?.slice(0, 1).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{session?.user.name}</span>
                <span className="truncate text-xs">{session?.user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={session?.user.image ?? ""} alt={session?.user.name} />
                  <AvatarFallback className="rounded-lg">
                    {session?.user.name?.slice(0, 1).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{session?.user.name}</span>
                  <span className="truncate text-xs">{session?.user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <Link href={`${process.env.NEXT_PUBLIC_APP_URL}/account`}>
                <DropdownMenuItem>
                  <BadgeCheck />
                  Account
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem>
                <Bell />
                Notifications
              </DropdownMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <DropdownMenuItem>
                    <SunMoonIcon />
                    Switch Theme
                  </DropdownMenuItem>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onSelect={() => setTheme("light")}>
                    <Sun />
                    Light
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setTheme("dark")}>
                    <Moon />
                    Dark
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setTheme("system")}>
                    <Laptop />
                    System
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <Link href={`${process.env.NEXT_PUBLIC_APP_URL}`}>
              <DropdownMenuItem>
                <LogOut />
                Exit
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
