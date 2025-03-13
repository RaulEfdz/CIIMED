"use client";

import { motion } from "framer-motion";
import HeroImagen from "@/components/customs/Features/HeroImage";
import { heroTrainingData } from "./data";

const Hero = () => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
  >
    <HeroImagen {...heroTrainingData} />
  </motion.div>
);

export default Hero;