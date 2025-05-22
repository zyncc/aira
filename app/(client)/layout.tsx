import type { Metadata } from "next";
import "../globals.css";
import Navbar from "@/components/navbar/navbar";
import { Libre_Baskerville } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Toaster } from "@/components/ui/sonner";
import { CartProvider } from "@/context/cart-context";
import Whatsapp from "@/components/whatsappButton";
import { ReactQueryProvider } from "@/lib/react-query-provider";
import { WishlistProvider } from "@/hooks/useWishlist";

const libre = Libre_Baskerville({
  subsets: ["latin", "latin-ext"],
  style: ["italic", "normal"],
  preload: true,
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Buy Affordable Linen Dresses for Women",
  description:
    "Aira is a homegrown brand catering to all your fashion needs at a one-stop destination for casuals, Party wear, Resort wear, Office wear, Everyday staples, that is committed to making you look good anytime, anywhere. Explore our wide range of products that embodies luxury and sustainability.",
  twitter: {
    card: "summary_large_image",
  },
};

// No Zooming
// export const viewport: Viewport = { maximumScale: 1, userScalable: false };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#000000" />
        <meta name="description" content="Aira Clothing" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/logo-512x512.png" />
        <meta name="apple-mobile-web-app-title" content="Aira" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="UTF-8" />
      </head>
      <body className={`${libre.className} antialiased`}>
        <ReactQueryProvider>
          <Whatsapp />
          <WishlistProvider>
            <CartProvider>
              <Navbar />
              <Toaster richColors position="top-right" />
              {children}
            </CartProvider>
          </WishlistProvider>
        </ReactQueryProvider>
      </body>
      <GoogleAnalytics gaId="G-BV9RNKQFLK" dataLayerName="google_analytics" />
    </html>
  );
}
