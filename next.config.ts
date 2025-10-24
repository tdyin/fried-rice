import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Allow build to complete even with type errors
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
