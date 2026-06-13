import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/LIBRARY-TEXT-TEST--COMPENT',
  assetPrefix: '/LIBRARY-TEXT-TEST--COMPENT',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
