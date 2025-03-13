"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import ProyectosSection from "./ProyectosSection";
import EstudiosSection from "./EstudiosSection";
import ReconocimientosSection from "./ReconocimientosSection";
import { ResearchLine } from "./ResearchLine";

const ResearchSections = () => {
  // Si cada subcomponente maneja su propio estado de carga, puedes eliminar este loading,
  // o dejarlo en false para mostrar el contenido inmediatamente.
  const [loading, setLoading] = useState(false);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Cargando investigación...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4">
      <section>
        <ResearchLine />
      </section>

      <section>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-6"
        >
          <ProyectosSection />
        </motion.div>
      </section>

      <section className="mt-28">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-6"
        >
          <EstudiosSection />
        </motion.div>
      </section>

      <section className="mt-28">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-6"
        >
          <ReconocimientosSection />
        </motion.div>
      </section>
    </div>
  );
};

export default ResearchSections;
