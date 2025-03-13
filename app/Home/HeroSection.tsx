import HeroBanner from "@/components/customs/Heros/HeroBanner";
import { motion } from "framer-motion";
import { heroSectionData } from "./data"; // Importar datos

export const HeroSection = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <HeroBanner {...heroSectionData} /> { /* Usar datos importados */ }
    </motion.div>
  );
};