import FacebookPixel from "@/components/FacebookPixel";
import Navbar from "@/components/navbar";
import NavbarSkeleton from "@/components/navbar-skeleton";
import { Toaster } from "@/components/ui/sonner";
import Whatsapp from "@/components/whatsapp-button";
import { CartProvider } from "@/hooks/useCart";
import ReactQueryProvider from "@/providers/react-query-provider";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Suspense } from "react";
import "../globals.css";

const poppins = Poppins({
  subsets: ["latin", "latin-ext"],
  style: ["italic", "normal"],
  preload: true,
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://airaclothing.in"),
  title: "Buy Affordable Linen Dresses for Women",
  description:
    "Aira is a homegrown brand catering to all your fashion needs at a one-stop destination for casuals, Party wear, Resort wear, Office wear, Everyday staples, that is committed to making you look good anytime, anywhere. Explore our wide range of products that embodies luxury and sustainability.",
  twitter: {
    card: "summary_large_image",
  },
  openGraph: {
    images: ["/opengraph-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#56756e" />
        <meta name="description" content="Aira Clothing" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/logo-512x512.png" />
        <meta name="apple-mobile-web-app-title" content="Aira" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="UTF-8" />
      </head>
      <body className={`${poppins.className} antialiased`}>
        <Analytics />
        <Suspense>
          <FacebookPixel />
        </Suspense>
        {/* <GoogleTagManager
          gtmId={process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID as string}
        />
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID as string} /> */}
        <ReactQueryProvider>
          <Whatsapp />
          <CartProvider>
            <Suspense fallback={<NavbarSkeleton />}>
              <Navbar />
            </Suspense>
            {children}
            <Toaster richColors theme="light" position="top-right" />
          </CartProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
