import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'kitchenpulse.s3.eu-west-2.amazonaws.com',
      },
    ],
  },
};

export default nextConfig;
