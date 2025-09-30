import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["images.unsplash.com", "yt3.googleusercontent.com", "cdn.pixabay.com", "unsplash.com", "utfs.io", "2dprahnec4.ufs.sh"], // Added UploadThing domain, removed Cloudinary
  },
};

export default nextConfig;
