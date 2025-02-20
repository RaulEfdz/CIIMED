"use client";

import React from "react";
import { History } from "lucide-react";
import { CldImage } from "next-cloudinary";
import { motion } from "framer-motion";

interface HistoryHeroProps {
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  imgW: number;
  imgH: number;
  foundation: {
    description: string;
    objectives: string[];
  };
}

const FoundationSection: React.FC<{ foundation: HistoryHeroProps["foundation"] }> = ({ foundation }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }} 
    animate={{ opacity: 1, y: 0 }} 
    transition={{ duration: 0.6 }}
    className="bg-transparent p-8 "
  >
    <h2 className="text-2xl font-bold text-gray-900 mb-4">Fundación y Objetivos</h2>
    <p className="text-gray-600 leading-relaxed mb-6">{foundation.description}</p>
    <ul className="space-y-4">
      {foundation.objectives.map((objective, index) => (
        <li key={index} className="flex items-start">
          <span className="text-bg-[#285C4D]  font-medium mr-2">{index + 1}.</span>
          <p className="text-gray-600">{objective}</p>
        </li>
      ))}
    </ul>
  </motion.div>
);

const HistoryHero: React.FC<HistoryHeroProps> = ({
  title,
  subtitle,
  description,
  imageUrl,
  imageAlt,
  imgW,
  imgH,
  foundation,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f2f2f2] via-white to-[#f2f2f2]">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 10" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-20 pb-16 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center justify-center px-4 py-2 bg-[#285C4D] mb-8 rounded-sm">
              <History className="w-5 h-5 text-[#f2f2f2] mr-2" aria-hidden="true" />
              <span className="text-[#f2f2f2] font-medium">{subtitle}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-[#285C4D] mb-6">{title}</h1>
            <p className="max-w-4xl mx-auto text-xl text-gray-600 leading-relaxed">{description}</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 grid lg:grid-cols-2 gap-16 items-center">
        <FoundationSection foundation={foundation} />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ duration: 0.8 }}
          className="rounded-sm overflow-hidden shadow-xl"
        >
          <CldImage
            className="w-full h-auto rounded-none"
            src={imageUrl}
            alt={imageAlt}
            width={imgW}
            height={imgH}
            layout="responsive"
            priority
          />
        </motion.div>
      </div>
    </div>
  );
};

export default HistoryHero;
