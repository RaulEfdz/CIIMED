"use client";

import React from "react";
import { motion } from "framer-motion";

import HistoryHero from "@/components/customs/Features/HistoryHero";
import Team from "@/components/customs/Features/Teams";
import Hero from "./Hero";
import AboutUs from "./AboutUs";
import { useInstitutionalInfo, getHistoryDataFromInstitutional } from "@/hooks/useInstitutionalInfo";

const About = () => {
  const { institutionalInfo, isLoading } = useInstitutionalInfo();
  
  // Obtener datos dinámicos de historia de la base de datos
  const dynamicHistoryData = getHistoryDataFromInstitutional(institutionalInfo);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 space-y-2">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="ml-3 text-gray-600">Cargando información...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 space-y-2">
      <AboutUs />

      {dynamicHistoryData && (
        <HistoryHero
          title="Historia"
          subtitle={institutionalInfo?.name || "Centro de Investigación e Innovación Médica"}
          description={institutionalInfo?.description || "Somos un centro líder en investigación médica, comprometido con la excelencia científica y la innovación en salud pública."}
          imageUrl={institutionalInfo?.historyImage || "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80"}
          imageAlt="CIIMED Instalaciones"
          imgW={800}
          imgH={600}
          foundation={dynamicHistoryData}
        />
      )}

      <section className="gradient  py-12">
        <Team />
      </section>
    </div>
  );
};

export default function AboutPage() {
  return (
    <motion.main
      className="bg-[#F2F2F2] pb-24"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <Hero />
      <section className="mt-20">
        <About />
      </section>
    </motion.main>
  );
}