import React, { useState, useEffect } from "react";
import { CldImage } from "next-cloudinary";
import Link from "next/link";
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
  socialLinks = [],
  scrollToNextSection,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY;
      setScrollPosition(position);
      setIsVisible(position < 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const parallaxOffset = scrollPosition * 0.5;

  return (
    <header className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Background Image with Parallax */}
      <motion.div 
        className="absolute inset-0 w-full h-full"
        style={{ y: parallaxOffset }}
      >
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
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
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
              {isVisible && socialLinks.length > 0 && (
                <motion.nav 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="flex gap-4"
                  aria-label="Enlaces a redes sociales"
                >
                  {socialLinks.map(({ icon, url, size = 40, color = "white", label }, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={label}
                        className="flex items-center justify-center hover:opacity-80 transition-opacity duration-200 border-b-2 border-white/70"
                        style={{ width: size, height: size, color }}
                      >
                        {icon}
                      </Link>
                    </motion.div>
                  ))}
                </motion.nav>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Scroll Indicator - Centered */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
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