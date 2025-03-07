"use client"
import React from "react";
import { CldImage } from "next-cloudinary";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface SocialLink {
  icon: React.ReactNode;
  url: string;
  size?: number;
  color?: string;
  label: string;
}

interface HeroBannerProps {
  imageUrl: string;
  imageAlt: string;
  imgW: number;
  imgH: number;
  overlayColor: string;
  title: string;
  subtitle: string;
  actions: React.ReactNode;
  socialLinks?: SocialLink[];
  scrollToNextSection?: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  imageUrl,
  imageAlt,
  imgW,
  imgH,
  overlayColor,
  title,
  subtitle,
  actions,
  scrollToNextSection,
}) => {




  return (
    <header className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Background Image with Parallax */}
      <motion.div 
        className="absolute inset-0 w-full h-full"
        initial={{ y: 0 }}>
        <CldImage
          alt={imageAlt}
          src={imageUrl}
          width={imgW}
          height={imgH}
          crop="fill"
          className="absolute inset-0 w-full h-full object-cover"
          priority
        />
      </motion.div>

      {/* Dynamic Gradient Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black/70"
        style={{ backgroundColor: overlayColor, mixBlendMode: "multiply" }}
      />

      {/* Content Container - Now positioned at bottom */}
      <div className="absolute bottom-0 w-full z-10 pb-8">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex flex-col lg:flex-row justify-between items-end gap-8">
            {/* Text Content - Left side */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="text-left max-w-2xl"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-4">
                {title}
              </h1>
              <p className="text-xl md:text-2xl text-gray-200 mb-6">
                {subtitle}
              </p>
              <div className="flex justify-start gap-4">
                {actions}
              </div>
            </motion.div>

            {/* Social Links - Right side */}
            <AnimatePresence>
           
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Scroll Indicator - Centered */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity:  1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={scrollToNextSection}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white cursor-pointer z-20"
        aria-label="Scroll to next section"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <ChevronDown size={32} />
        </motion.div>
      </motion.button>
    </header>
  );
};

HeroBanner.displayName = "HeroBanner";

export default HeroBanner;