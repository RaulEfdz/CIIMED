"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

// Definimos los tipos para las variantes de tema
type ThemeVariant = "orange" | "dark" | "light" | "green" | "multi";
const baseThemes: ThemeVariant[] = ["dark", "orange"];
const themes: ThemeVariant[] = [...baseThemes, "green"];

// Duración total de la animación (incluyendo el último color "green")
const t = (themes.length + 1) * 1000; // Agregamos 1 más para garantizar que el último color sea "green"

interface OpeningProps {
  themeVariant?: ThemeVariant;
}

const Opening: React.FC<OpeningProps> = ({ themeVariant = "multi" }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [currentTheme, setCurrentTheme] = useState<ThemeVariant>(themeVariant);

  useEffect(() => {
    if (themeVariant === "multi") {
      let index = 0;
      const intervalDuration = t / (themes.length + 1); // +1 para la última transición forzada a "green"

      const changeTheme = setInterval(() => {
        if (index < baseThemes.length) {
          setCurrentTheme(themes[index]);
          index++;
        } else {
          setCurrentTheme("green");
          clearInterval(changeTheme); // Detener cambios después de llegar a "green"
        }
      }, intervalDuration);

      const timer = setTimeout(() => {
        setIsVisible(false);
        clearInterval(changeTheme);
      }, t);

      return () => {
        clearTimeout(timer);
        clearInterval(changeTheme);
      };
    } else {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, t);
      return () => clearTimeout(timer);
    }
  }, [themeVariant]);

  const themeColors: Record<ThemeVariant, string> = {
    green: "#285C4D",
    orange: "#F4633A",
    dark: "#212322",
    light: "#F2F2F2",
    multi: "#285C4D", // Valor inicial para evitar errores
  };

  return isVisible ? (
    <motion.div
      className="fixed top-0 left-0 w-screen h-screen flex justify-center items-center z-50"
      style={{ backgroundColor: themeColors[currentTheme] }}
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
      }} // Salida más suave con una leve expansión
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
        }} // Suavizamos la salida
      >
        <Image
          src="/logo_blanco.png"
          alt="Logo"
          width={64}
          height={64}
          className="w-16 h-16"
        />
      </motion.div>
    </motion.div>
  ) : null;
};

export default Opening;
