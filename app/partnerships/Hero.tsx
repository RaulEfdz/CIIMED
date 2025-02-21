"use client";

// components/Hero.tsx
import { motion } from "framer-motion";
import HeroImagen from "@/components/customs/Features/HeroImage";
export const HIGHLIGHT_COLOR = "#285C4D";

const Hero = () => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
  >
    <HeroImagen
      title="Alianzas Estratégicas"
      subtitle="Colaboramos con organizaciones innovadoras para impulsar avances científicos y tecnológicos que transformen el futuro de la salud."
      imageUrl="https://cdn.pixabay.com/photo/2017/02/01/13/52/analysis-2030261_1280.jpg"
      primaryButton={{ text: "Comenzar ahora", link: "#", disabled: true }}
      secondaryButton={{ text: "Ver tour", link: "#", disabled: true }}
      overlayColor={HIGHLIGHT_COLOR} 
      highlight={"/highlights/Comunidad.png"}    />
  </motion.div>
);

export default Hero;