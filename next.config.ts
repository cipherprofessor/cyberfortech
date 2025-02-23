/** @type {import('next').NextConfig} */
require("dotenv").config();

const regexEqual = (x, y) => {
  return (
    x instanceof RegExp &&
    y instanceof RegExp &&
    x.source === y.source &&
    x.global === y.global &&
    x.ignoreCase === y.ignoreCase &&
    x.multiline === y.multiline
  );
};

// Overrides for css-loader plugin
function cssLoaderOptions(modules = {}) {
  return {
    localIdentName: "[hash:base64:6]",
    exportLocalsConvention: "camelCaseOnly",
    mode: "global",
    auto: true,
    exportGlobals: true,
    localIdentContext: __dirname,
  };
}

const nextConfig = {
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
    const oneOf = config.module.rules.find(
      (rule) => typeof rule.oneOf === "object"
    );

    if (oneOf) {
      // Find the module which targets *.scss|*.sass files
      const moduleSassRule = oneOf.oneOf.find((rule) =>
        regexEqual(rule.test, /\.module\.(scss|sass)$/)
      );

      if (moduleSassRule) {
        // Get the config object for css-loader plugin
        const cssLoader = moduleSassRule.use.find(({ loader }) =>
          loader.includes("css-loader")
        );
        
        if (cssLoader) {
          cssLoader.options = {
            ...cssLoader.options,
            modules: {
              ...cssLoaderOptions(),
              generateScopedName: '[name]__[local]__[hash:base64:5]',
              exportOnlyLocals: false,
              globalModulePaths: [/global/, /node_modules/],
            },
          };
        }
      }
    }
    return config;
  },
};

module.exports = nextConfig;