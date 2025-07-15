"use client";
import React from "react";
import NewsContainer from "@/components/customs/Features/News";
import { motion } from "framer-motion"; // Importación de Framer Motion
import { News } from "@/app/data/news";
import { VideoGallery } from "./VideoGallery";
import { InstagramGallery } from "./InstagramGallery";
import { SpotifyGallery } from "./SpotifyGallery";
import Hero from "./Hero";

export default function scientificDisseminationPage() {
  return (
    <motion.main
      className="min-h-screen bg-gradient-to-b from-[#f2f2f2] via-white to-[#f2f2f2]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <Hero />
      <main className="max-w-6xl mx-auto px-4 w-full sm:px-6 py-16"> 

      <motion.section
        className=""
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <SpotifyGallery />

        <VideoGallery />
        <InstagramGallery />
        <NewsContainer news={News} />
      </motion.section>
      </main>
      </motion.main>
  );
}
