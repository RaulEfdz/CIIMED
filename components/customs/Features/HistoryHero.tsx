"use client";

import React from "react";
import {
  History,
  FlaskConical,
  Stethoscope,
  Building2,
  Microscope
} from "lucide-react";
import { CldImage } from "next-cloudinary";
import { motion } from "framer-motion";

interface ResearchLine {
  title: string;
  description: string;
  icon: React.ReactNode;
}

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
  researchLines: {
    title: string;
    description: string;
  }[];
  collaborations: string[];
  impact: string;
  future: string;
}

const HistoryHero: React.FC<HistoryHeroProps> = ({
  title,
  subtitle,
  description,
  imageUrl,
  imageAlt,
  imgW,
  imgH,
  foundation,
  researchLines,
  collaborations,
  impact,
  future
}) => {
  const researchLinesList: ResearchLine[] = researchLines.map((line, index) => {
    const icons = [
      <Stethoscope className="w-6 h-6 text-blue-600" key="stethoscope" />, 
      <Building2 className="w-6 h-6 text-blue-600" key="building" />, 
      <FlaskConical className="w-6 h-6 text-blue-600" key="flask" />
    ];
    return {
      ...line,
      icon: icons[index] || <Microscope className="w-6 h-6 text-blue-600" />
    };
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-blue-500/[0.03] -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center px-4 py-2 bg-blue-100 mb-8">
              <History className="w-5 h-5 text-blue-600 mr-2" />
              <span className="text-blue-600 font-medium">{subtitle}</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight mb-6">
              {title}
            </h1>
            <p className="max-w-4xl mx-auto text-xl text-gray-600 leading-relaxed">
              {description}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid lg:grid-cols-2 gap-16 items-start">
        {/* Left Column */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-12"
        >
          {/* Foundation Section */}
          <div className="bg-white p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Fundación y Objetivos</h2>
            <p className="text-gray-600 leading-relaxed mb-6">{foundation.description}</p>
            <ul className="space-y-4">
              {foundation.objectives.map((objective, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-600 font-medium mr-2">{index + 1}.</span>
                  <p className="text-gray-600">{objective}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Research Lines */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">Líneas de Investigación</h2>
            <div className="grid gap-6">
              {researchLinesList.map((line, index) => (
                <div key={index} className="bg-white p-6 shadow-sm flex items-start">
                  <div className="mr-4">{line.icon}</div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{line.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{line.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right Column - Image */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <CldImage
            className="w-full h-auto shadow-xl justify-center align-middle flex-1 items-center"
            src={imageUrl}
            alt={imageAlt}
            width={imgW}
            height={imgH}
          />
        </motion.div>
      </div>

      {/* Collaborations & Impact */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid gap-6">
        <div className="bg-white p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Colaboraciones</h2>
          <ul className="space-y-4">
            {collaborations.map((collab, index) => (
              <li key={index} className="text-gray-600">{collab}</li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Impacto</h2>
          <p className="text-gray-600 leading-relaxed">{impact}</p>
        </div>

        <div className="bg-blue-600 p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Perspectivas Futuras</h2>
          <p className="leading-relaxed">{future}</p>
        </div>
      </div>
    </div>
  );
};

export default HistoryHero;