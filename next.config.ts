import withPlaiceholder from "@plaiceholder/next";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  generateBuildId: async () => {
    return process.env.GITHUB_SHA as string;
  },
  experimental: {
    ppr: "incremental",
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
