"use client";

import { motion } from "framer-motion";
import HeroImagen from "@/components/customs/Features/HeroImage";
import { heroData } from "./data";
import { useInstitutionalInfo, getHeroDataFromInstitutional } from "@/hooks/useInstitutionalInfo";

const Hero = () => {
  const { institutionalInfo, isLoading } = useInstitutionalInfo();
  
  // Obtener datos dinámicos del hero de la base de datos
  const dynamicHeroData = getHeroDataFromInstitutional(institutionalInfo);
  
  // Usar datos dinámicos si están disponibles, sino usar datos por defecto
  const heroDataToUse = dynamicHeroData || heroData;

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="h-64 bg-gray-200 animate-pulse flex items-center justify-center"
      >
        <div className="text-gray-500">Cargando...</div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <HeroImagen
        title={heroDataToUse.title}
        subtitle={heroDataToUse.subtitle}
        imageUrl={heroDataToUse.imageUrl}
        primaryButton={heroDataToUse.primaryButton}
        secondaryButton={heroDataToUse.secondaryButton}
        overlayColor={heroDataToUse.overlayColor}
        highlight={heroDataToUse.highlight}
      />
    </motion.div>
  );
};

export default Hero;