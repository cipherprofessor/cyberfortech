import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
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
      },
      {
        hostname: 'daxg39y63pxwu.cloudfront.net'
      },
      {
        hostname: 'imagekit.io'
      },
      {
        hostname: 'loremflickr.com'
      },
      {
        hostname: 'ik.imagekit.io'
      },
      {
        hostname: 'i.pravatar.cc'
      }
    ],
  },
};

export default nextConfig;
