import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin/",
        "/admin",
        "/privacy",
        "/terms",
        "/refunds",
        "/account",
        "/checkout",
        "/paymentstatus",
        "/search",
        "/reviews",
        "/reviews/add",
        "/reviews/all",
      ],
    },
    sitemap: "https://airaa.vercel.app/sitemap.xml",
  };
}
