import withPlaiceholder from "@plaiceholder/next";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typedRoutes: false,
  experimental: {
    ppr: "incremental",
    useCache: true,
    typedEnv: true,
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
};

export default withPlaiceholder(nextConfig);
