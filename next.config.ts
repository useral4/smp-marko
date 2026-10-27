import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 2_592_000,
  },
  compress: true,
  async redirects() {
    return [
      {
        source: "/novosti/balki-marko",
        destination: "/news/balki-marko",
        statusCode: 301,
      },
    ];
  },
};

export default nextConfig;
