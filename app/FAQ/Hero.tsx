"use client";

// components/Hero.tsx
import { motion } from "framer-motion";
import HeroImagen from "@/components/customs/Features/HeroImage";
export const HIGHLIGHT_COLOR = "#285C4D";

export const Hero = () => (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <HeroImagen
        title="Asistente de Preguntas Frecuentes"
        subtitle="Descubre respuestas instantáneas sobre nuestros servicios y cómo participar."
        imageUrl="https://cdn.pixabay.com/photo/2019/04/03/03/05/medical-equipment-4099428_1280.jpg"
        primaryButton={{ text: "Haz una pregunta", link: "#", disabled: false }}
        secondaryButton={{ text: "Explorar más", link: "#", disabled: false }}
        overlayColor={HIGHLIGHT_COLOR}
      />
    </motion.div>
  );