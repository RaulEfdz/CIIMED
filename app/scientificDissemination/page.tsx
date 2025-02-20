"use client";
import React from "react";
import NewsContainer from "@/components/customs/Features/News";
import { motion } from "framer-motion"; // Importación de Framer Motion
import { db } from "../data/db";
import CourseSection from "../training/TrainingCrads";
import { VideoGallery } from "./VideoGallery";
import { InstagramGallery } from "./InstagramGallery";
import { SpotifyGallery } from "./SpotifyGallery";

export default function scientificDisseminationPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8 lg:pt-28">
      {/* <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">
        Divulgación y Comunicación Científica
      </h1> */}

      <motion.section
        className=""
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <NewsContainer news={db.news} />
        <CourseSection />
        <VideoGallery />
        <SpotifyGallery/>
        <InstagramGallery />
      </motion.section>
    </div>
  );
}
