import type { Metadata } from "next";
import "../globals.css";
import Navbar from "@/components/navbar/navbar";
import { Toaster } from "@/components/ui/toaster";
import Script from "next/script";
import { SpeedInsights } from "@vercel/speed-insights/next";
import NextTopLoader from "nextjs-toploader";
import TanstackProvider from "@/lib/TanstackProvider";

export const metadata: Metadata = {
  title: "Aira",
  description: "Aira Shopping",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-B07TPNLBKT"
        ></Script>
        <Script id="google-analytics">
          {`window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-B07TPNLBKT');`}
        </Script>
        <meta
          name="google-site-verification"
          content="2q79Eq6b6YD4luQsXPMJCN_OL_3QTK_B8VqdWralAPA"
        />
        <meta name="theme-color" content="#000000" />
        <meta name="description" content="Aira Shopping PWA" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/logo-330x330.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="UTF-8" />
      </head>
      <body>
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
