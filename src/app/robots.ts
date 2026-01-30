import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      crawlDelay: 0,
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin/",
        "/admin",
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
