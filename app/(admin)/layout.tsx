import type { Metadata } from "next";
import "../globals.css";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { Poppins } from "next/font/google";
import { ThemeProvider } from "@/lib/theme-provider";
import { ReactQueryProvider } from "@/lib/react-query-provider";

export const metadata: Metadata = {
  title: "Aira Admin Panel",
  description: "Aira",
};

const poppins = Poppins({
  subsets: ["latin", "latin-ext"],
  style: ["italic", "normal"],
  preload: true,
  weight: ["400", "700", "500", "100", "200", "300", "600", "800", "900"],
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <ReactQueryProvider>
        <body className={`${poppins.className}`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <SidebarProvider defaultOpen={false}>
              <AppSidebar />
              {children}
              <Toaster richColors position="top-right" />
            </SidebarProvider>
          </ThemeProvider>
        </body>
      </ReactQueryProvider>
    </html>
  );
}
