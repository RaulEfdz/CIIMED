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
      title="Participa con Nosotros
"
      subtitle="Descubre cómo formar parte de nuestra comunidad y aprovecha nuevas oportunidades para tu crecimiento."
      imageUrl="https://cdn.pixabay.com/photo/2019/04/03/03/05/medical-equipment-4099428_1280.jpg"
      primaryButton={{ text: "Comenzar ahora", link: "#", disabled: true }}
      secondaryButton={{ text: "Ver tour", link: "#", disabled: true }}
      overlayColor={HIGHLIGHT_COLOR}
      highlight="/highlights/Nosotros.png"
    />
  </motion.div>
);

export default Hero;