import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'yt3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.pixabay.com',
      },
      {
        protocol: 'https',
        hostname: 'unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'utfs.io',
      },
      {
        protocol: 'https',
        hostname: '2dprahnec4.ufs.sh',
      },
    ],
  },
  // Reduce noise in development logs
  logging: {
    fetches: {
      fullUrl: false,
    },
  },
  // Handle source maps better in development
  productionBrowserSourceMaps: false,
};

export default nextConfig;
