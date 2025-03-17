import type { Metadata } from "next";
import "../globals.css";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";

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
      <body className="dark">
        <SidebarProvider>
          <AppSidebar />
          {children}
          <Toaster richColors position="top-right" />
        </SidebarProvider>
      </body>
    </html>
  );
}
