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
      title="Divulgación y Comunicación Científica"
      subtitle="Acercando la ciencia a todos con claridad e impacto"
      imageUrl="https://cdn.pixabay.com/photo/2016/11/29/03/53/camera-1867184_1280.jpg"
      primaryButton={{ text: "Comenzar ahora", link: "#", disabled: true }}
      secondaryButton={{ text: "Ver tour", link: "#", disabled: true }}
      overlayColor={HIGHLIGHT_COLOR} 
      highlight={"/highlights/Comunidad.png"}    />
  </motion.div>
);

export default Hero;