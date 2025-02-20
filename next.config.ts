import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["res.cloudinary.com", "images.unsplash.com", "yt3.googleusercontent.com", "cdn.pixabay.com", "unsplash.com"], // Agrega el dominio de la imagen aquí
  },
};

export default nextConfig;
