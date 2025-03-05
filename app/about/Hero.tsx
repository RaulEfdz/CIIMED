"use client";

// components/Hero.tsx
import { motion } from "framer-motion";
import HeroImagen from "@/components/customs/Features/HeroImage";
const HIGHLIGHT_COLOR = "#285C4D";

const Hero = () => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
  >
    <HeroImagen
      title="Sobre Nosotros"
      subtitle="CIIMED es un centro de investigación líder en el desarrollo de innovaciones médicas y científicas."
      imageUrl="https://res.cloudinary.com/doyfs0fiu/image/upload/v1738280298/jcue8atmcjfv9aea2sw0.jpg"
      primaryButton={{ text: "Comenzar ahora", link: "#", disabled: true }}
      secondaryButton={{ text: "Ver tour", link: "#", disabled: true }}
      overlayColor={HIGHLIGHT_COLOR}
      highlight={"/highlights/Nosotros.png"} 
    />
  </motion.div>
);

export default Hero;