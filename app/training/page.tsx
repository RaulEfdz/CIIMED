"use client";

import { motion } from "framer-motion";
import CourseSection from "./TrainingCrads";
import Hero from "./Hero";
import FormContact from "./Form";


const TrainingPage = () => (
  <motion.main
    className="min-h-screen bg-gradient-to-b bg-[#F2F2F2]"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.6 }}
  >
    <Hero />
    <main className="max-w-7xl mx-auto px-4 w-full sm:px-6 py-16">
      <CourseSection />
      <FormContact/>
    </main>
  </motion.main>
);

export default TrainingPage;