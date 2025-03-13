"use client";

import News from "@/components/customs/Features/News";
import { db } from "../data/db";
import EventsContainer from "@/components/customs/Features/Events";
import Team from "@/components/customs/Features/Teams";
import { motion } from "framer-motion";
import { HeroSection } from "./HeroSection";
import { FeatureInit } from "./FeatureInit";

export default function Home() {
  return (
    <div className="w-full h-full bg-gradient-to-b from-[#f2f2f2] via-white to-[#f2f2f2]">
      <HeroSection />
      <FeatureInit />
      <motion.section
        className=""
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <Team />
      </motion.section>
      <motion.section
        className=""
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <News news={db.news} />
      </motion.section>
      <motion.section
        className=""
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <EventsContainer events={db.events} />
      </motion.section>
    </div>
  );
}