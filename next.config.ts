import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'assets.aceternity.com',
      },
      {
        hostname: 'images.unsplash.com',
      },
      {
        hostname: 'img.clerk.com',
      },
      {
        hostname: 'pbs.twimg.com'
      }
    ],
  },
};

export default nextConfig;
