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
  webpack: (config) => {
    const rules = config.module.rules
      .find((rule) => typeof rule === 'object' && rule.oneOf)
      ?.oneOf?.filter((rule) => 
        rule?.sideEffects === false && 
        rule?.use?.loader?.includes('css-loader') &&
        rule?.use?.options?.modules
      ) ?? [];

    rules.forEach((rule) => {
      if (rule?.use?.options?.modules) {
        rule.use.options.modules = {
          ...rule.use.options.modules,
          mode: 'global'
        };
      }
    });

    return config;
  }
};

export default nextConfig;