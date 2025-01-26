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
      }
    ],
  },
};

export default nextConfig;
