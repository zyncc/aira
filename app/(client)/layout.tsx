import type { Metadata, Viewport } from "next";
import "../globals.css";
import Navbar from "@/components/navbar/navbar";
import { Toaster } from "@/components/ui/toaster";
import { SpeedInsights } from "@vercel/speed-insights/next";
import NextTopLoader from "nextjs-toploader";
import TanstackProvider from "@/lib/TanstackProvider";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin", "latin-ext"],
  style: ["italic", "normal"],
  preload: true,
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Aira",
  description: "Aira Shopping",
  twitter: {
    card: "summary_large_image",
  },
};

export const viewport: Viewport = { maximumScale: 1, userScalable: false };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#000000" />
        <meta name="description" content="Aira Shopping PWA" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/logo-330x330.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="UTF-8" />
      </head>
      <body className={`${poppins.className}`}>
        <NextTopLoader
          color={"#65837b"}
          showSpinner={false}
          speed={200}
          easing="ease"
          height={3}
          crawlSpeed={200}
        />
        <TanstackProvider>
          <Navbar />
          <Toaster />
          <SpeedInsights />
          {children}
        </TanstackProvider>
      </body>
    </html>
  );
}
