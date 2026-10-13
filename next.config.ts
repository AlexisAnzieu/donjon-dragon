import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@napi-rs/canvas"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.aidedd.org",
      },
      {
        protocol: "https",
        hostname: "*.nocookie.net",
      },
      {
        protocol: "https",
        hostname: "5e.tools",
      },
    ],
  },
};

export default nextConfig;
