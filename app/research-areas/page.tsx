// app/research/page.tsx o pages/research.tsx
"use client";

import { motion } from "framer-motion";
import HighlightHero from "./HighlightHero";
import ResearchSections from "./ResearchSections";


export default function ResearchPage() {
  return (
    <motion.main
      className="bg-[#F2F2F2] pb-24"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <HighlightHero />
      <ResearchSections />
    </motion.main>
  );
}
