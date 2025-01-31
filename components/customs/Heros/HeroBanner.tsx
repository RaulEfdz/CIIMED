import React from "react";
import { CldImage } from "next-cloudinary";
import Link from "next/link";

interface SocialLink {
  icon: React.ReactNode;
  url: string;
  size?: number;
  color?: string;
}

interface HeroBannerProps {
  imageUrl: string;
  imageAlt: string;
  imgW: number;
  imgH: number;
  title: string;
  subtitle: string;
  actions: React.ReactNode;
  socialLinks?: SocialLink[];
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  imageUrl,
  imageAlt,
  imgW,
  imgH,
  title,
  subtitle,
  actions,
  socialLinks = [],
}) => {
  return (
    <div className="relative w-full h-[80vh] lg:h-[85vh] overflow-hidden flex flex-col items-center justify-center">
      {/* Imagen de fondo */}
      <CldImage
        alt={imageAlt}
        src={imageUrl}
        width={imgW}
        height={imgH}
        crop="fill"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Contenido */}
      <div className="relative z-10 text-white text-center  px-6  h-[full] w-full justify-center flex flex-col ">
        <div className="  w-[40%] text-left mt-[20%] ml-[5%]">
          <h1 className="text-3xl sm:text-5xl font-bold leading-tight shadow-text">
            {title}
          </h1>
          <p className="text-lg sm:text-2xl mt-4 shadow-text">{subtitle}</p>
          {actions}
        </div>
      </div>

      {/* Redes sociales */}
      {socialLinks.length > 0 && (
        <div className="absolute bottom-6 flex gap-4 cursor-pointer z-100">
          {socialLinks.map(
            ({ icon, url, size = 50, color = "white" }, index) => (
              <Link
                key={index}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center hover:opacity-70 cursor-pointer"
                style={{ width: size, height: size, color: color }}
              >
                {icon}
              </Link>
            )
          )}
        </div>
      )}
    </div>
  );
};

HeroBanner.displayName = "HeroBanner";
