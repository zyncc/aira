import Navbar from "@/components/navbar";
import { Toaster } from "@/components/ui/sonner";
import Whatsapp from "@/components/whatsapp-button";
import { CartProvider } from "@/hooks/useCart";
import ReactQueryProvider from "@/providers/react-query-provider";
import { GoogleAnalytics } from "@next/third-parties/google";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Script from "next/script";
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
        <meta name="theme-color" content="#000000" />
        <meta name="description" content="Aira Clothing" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/logo-512x512.png" />
        <meta name="apple-mobile-web-app-title" content="Aira" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="UTF-8" />
        <Script id="fb-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n; n.push=n; n.loaded=!0; n.version='2.0';
            n.queue=[]; t=b.createElement(e); t.async=!0;
            t.src=v; s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            
            fbq('init', '1577253823650108'); 
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript
          dangerouslySetInnerHTML={{
            __html: `
              <img height="1" width="1" style="display:none"
              src="https://www.facebook.com/tr?id=1577253823650108&ev=PageView&noscript=1"/>
            `,
          }}
        />
      </head>
      <body className={`${poppins.className} antialiased`}>
        <GoogleAnalytics gaId="G-BV9RNKQFLK" />
        <ReactQueryProvider>
          <Whatsapp />
          <CartProvider>
            <Navbar />
            {children}
            <Toaster richColors position="top-right" />
          </CartProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
