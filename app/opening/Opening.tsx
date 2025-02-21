// Opening.jsx
"use client"
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const Opening = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const containerVariants = {
    // initial: { opacity: 1 },
    animate: { opacity: 0, transition: { duration: 3, ease: "easeIn" } },
    // exit: { opacity: 0 }, // Asegura que desaparezca completamente al desmontar
  };

  return isVisible ? (
    <motion.div
      className="fixed top-0 left-0 w-screen h-screen bg-[#285C4D] flex justify-center items-center z-50"
      variants={containerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="flex justify-center items-center">
        <Image src="/logo_blanco.png" alt="Logo" width={64} height={64} className="w-16 h-16" /> {/* w-16 h-16 son equivalentes a 64px asumiendo la configuración por defecto de Tailwind */}
      </div>
    </motion.div>
  ) : null;
};

export default Opening;