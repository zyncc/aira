import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: ["facebookexternalhit", "meta-externalads"],
        allow: "/",
        disallow: ["/*meta.json$"],
      },
      {
        userAgent: "*",
        crawlDelay: 0,
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
          "/*meta.json$",
        ],
      },
    ],
    sitemap: "https://airaclothing.in/sitemap.xml",
  };
}
