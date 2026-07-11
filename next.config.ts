import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @ts-expect-error - eslint property might be missing from NextConfig type in Next 16 beta
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
