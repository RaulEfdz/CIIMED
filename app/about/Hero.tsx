"use client";

import { motion } from "framer-motion";
import HeroImagen from "@/components/customs/Features/HeroImage";
import { heroData } from "./data";

const Hero = () => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
  >
    <HeroImagen
      title={heroData.title}
      subtitle={heroData.subtitle}
      imageUrl={heroData.imageUrl}
      primaryButton={heroData.primaryButton}
      secondaryButton={heroData.secondaryButton}
      overlayColor={heroData.overlayColor}
      highlight={heroData.highlight}
    />
  </motion.div>
);

export default Hero;