import Navbar from "@/components/navbar";
import { Toaster } from "@/components/ui/sonner";
import Whatsapp from "@/components/whatsapp-button";
import { CartProvider } from "@/hooks/useCart";
import ReactQueryProvider from "@/providers/react-query-provider";
import { GoogleAnalytics } from "@next/third-parties/google";
import type { Metadata } from "next";
import { Libre_Baskerville } from "next/font/google";
import "../globals.css";

const libre = Libre_Baskerville({
  subsets: ["latin", "latin-ext"],
  style: ["italic", "normal"],
  preload: true,
  weight: ["400", "700"],
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
          <CartProvider>
            <Navbar />
            {children}
            <Toaster richColors position="bottom-right" />
          </CartProvider>
        </ReactQueryProvider>
      </body>
      <GoogleAnalytics gaId="G-BV9RNKQFLK" dataLayerName="google_analytics" />
    </html>
  );
}
