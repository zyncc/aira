import MillionLint from "@million/lint";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default MillionLint.next({
  enabled: false,
  rsc: true,
  filter: {
    include: "**/components/*.{mtsx,mjsx,tsx,jsx}",
  },
})(nextConfig);
