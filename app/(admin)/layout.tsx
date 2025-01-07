import type { Metadata } from "next";
import "../globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/lib/themeProvider";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AdminSidebar from "@/components/admin/admin-sidebar";

export const metadata: Metadata = {
  title: "Aira Admin Panel",
  description: "Aira",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SidebarProvider defaultOpen={true}>
          <AdminSidebar />
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <SidebarTrigger className="m-2" />
            {children}
          </ThemeProvider>
          <Toaster />
        </SidebarProvider>
      </body>
    </html>
  );
}
