import withPlaiceholder from "@plaiceholder/next";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  turbopack: {},
  cacheComponents: true,
  cacheLife: {
    oneday: {
      stale: 60 * 60 * 24, // 1 day
      revalidate: 60 * 60 * 24, // 1 day
      expire: 60 * 60 * 24, // 1 day
    },
  },
  experimental: {
    typedEnv: true,
    // turbopackFileSystemCacheForDev: true,
    // turbopackFileSystemCacheForBuild: true,
    authInterrupts: true,
    serverActions: {
      bodySizeLimit: "25mb",
      allowedOrigins: ["api.razorpay.com"],
    },
  },
  images: {
    minimumCacheTTL: 2678400, // 30 days
    unoptimized: true,
    remotePatterns: [
      {
        hostname: "*",
        protocol: "https",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "X-Accel-Buffering",
            value: "no",
          },
        ],
      },
      {
        source: "/sw.js",
        headers: [
          {
            key: "Content-Type",
            value: "application/javascript; charset=utf-8",
          },
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate",
          },
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'; script-src 'self'",
          },
        ],
      },
    ];
  },
};

export default withPlaiceholder(nextConfig);
