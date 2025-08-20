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
        "/search",
        "/reviews/all",
        "/signin",
      ],
    },
    sitemap: "https://airaclothing.in/sitemap.xml",
  };
}
