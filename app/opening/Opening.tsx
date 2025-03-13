"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { openingData, ThemeVariant } from "./data"; // Importar datos

interface OpeningProps {
  themeVariant?: ThemeVariant;
}

const Opening: React.FC<OpeningProps> = ({ themeVariant = "green" }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [currentTheme, setCurrentTheme] = useState<ThemeVariant>(themeVariant);

  useEffect(() => {
    if (themeVariant === "multi") {
      let index = 0;
      const intervalDuration = openingData.animationDuration / (openingData.themes.length + 1);

      const changeTheme = setInterval(() => {
        if (index < openingData.baseThemes.length) {
          setCurrentTheme(openingData.themes[index]);
          index++;
        } else {
          setCurrentTheme("green");
          clearInterval(changeTheme);
        }
      }, intervalDuration);

      const timer = setTimeout(() => {
        setIsVisible(false);
        clearInterval(changeTheme);
      }, openingData.animationDuration);

      return () => {
        clearTimeout(timer);
        clearInterval(changeTheme);
      };
    } else {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, openingData.animationDuration);
      return () => clearTimeout(timer);
    }
  }, [themeVariant]);

  return isVisible ? (
    <motion.div
      className="fixed top-0 left-0 w-screen h-screen flex justify-center items-center z-50"
      style={{ backgroundColor: openingData.themeColors[currentTheme] }}
      initial={{ opacity: 1, scale: 1 }}
      animate={{
        opacity: 1,
        scale: 1,
        transition: { duration: 1, ease: "easeOut" },
      }}
      exit={{
        opacity: 0,
        scale: 1.1,
        transition: { duration: 2, ease: "easeInOut", delay: 0.3 },
      }}
    >
      <motion.div
        className="flex justify-center items-center"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{
          scale: 1,
          opacity: 1,
          transition: { duration: 1, ease: "easeOut" },
        }}
        exit={{
          scale: 0.9,
          opacity: 0,
          transition: { duration: 2, ease: "easeInOut", delay: 0.3 },
        }}
      >
        <Image
          src={openingData.logoSrc}
          alt={openingData.logoAlt}
          width={openingData.logoWidth}
          height={openingData.logoHeight}
          className="w-16 h-16"
        />
      </motion.div>
    </motion.div>
  ) : null;
};

export default Opening;