"use client";

import React from "react";
import { motion } from "framer-motion";

import HistoryHero from "@/components/customs/Features/HistoryHero";
import Team from "@/components/customs/Features/Teams";
import GaleryInfra from "@/components/customs/Features/GaleryInfra";
import Hero from "./Hero";
import AboutUs from "./AboutUs";
import { historyData } from "./data";

const About = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 space-y-2">
      <AboutUs />

      <HistoryHero
        title="Historia"
        subtitle="Centro de Investigación e Innovación Médica"
        description="Somos un centro líder en investigación médica, comprometido con la excelencia científica y la innovación en salud pública."
        imageUrl="jcue8atmcjfv9aea2sw0"
        imageAlt="CIIMED Instalaciones"
        imgW={800}
        imgH={600}
        foundation={historyData}
      />

      <section className="gradient  py-12">
        <Team />
        <GaleryInfra />
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