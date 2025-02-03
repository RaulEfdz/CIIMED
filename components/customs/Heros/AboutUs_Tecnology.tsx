"use client";

import React from "react";
import {
  Microscope,
  HeartPulse,
  Dna,
  GraduationCap,
  FlaskRound as Flask,
  Users,
} from "lucide-react";
import { CldImage } from "next-cloudinary";
import { motion } from "framer-motion";

interface AboutUsProps {
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  imgW: number;
  imgH: number;
  mission: string;
  vision: string;
}

const AboutUs: React.FC<AboutUsProps> = ({
  title,
  description,
  imageUrl,
  imageAlt,
  imgW,
  imgH,
  mission,
  vision,
}) => {
  const achievements = [
    {
      icon: Flask,
      title: "Investigaciones",
      value: "150+",
      description: "Proyectos de investigación completados",
    },
    {
      icon: Users,
      title: "Pacientes",
      value: "10000+",
      description: "Personas beneficiadas",
    },
    {
      icon: GraduationCap,
      title: "Publicaciones",
      value: "75+",
      description: "Artículos científicos publicados",
    },
  ];

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
            <div className="inline-flex items-center justify-center px-4 py-2 bg-blue-100 rounded-none mb-8">
              <Microscope className="w-5 h-5 text-blue-600 mr-2" />
              <span className="text-blue-600 font-medium">
                Centro de Investigación
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight mb-6">
              {title}
            </h1>
            <p className="max-w-3xl mx-auto text-xl text-gray-600 leading-relaxed">
              {description}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-none transform translate-x-3 translate-y-3 opacity-20" />
            <div className="relative">
              <CldImage
                className="w-full h-auto rounded-none shadow-xl"
                src={imageUrl}
                alt={imageAlt}
                width={imgW}
                height={imgH}
              />
              <div className="absolute inset-0 rounded-none ring-1 ring-inset ring-black/10" />
            </div>
          </motion.div>

          {/* Stats Grid */}
          <div className="space-y-12">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="grid gap-8"
            >
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-6 p-6 bg-white rounded-none shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100"
                >
                  <div className="flex-shrink-0">
                    <div className="p-3 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-none">
                      <achievement.icon className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">
                      {achievement.value}
                    </div>
                    <div className="text-sm font-medium text-gray-500">
                      {achievement.description}
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Mission & Vision */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="grid md:grid-cols-2 gap-8"
        >
          {/* Mission */}
          <div className="relative group">
            <div className="absolute -inset-px bg-gradient-to-r from-blue-600 to-cyan-500 rounded-none opacity-20 group-hover:opacity-30 transition-opacity" />
            <div className="relative bg-white p-8 rounded-none shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-none">
                  <HeartPulse className="h-6 w-6 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 ml-4">
                  Misión
                </h2>
              </div>
              <p className="text-gray-600 leading-relaxed">{mission}</p>
            </div>
          </div>

          {/* Vision */}
          <div className="relative group">
            <div className="absolute -inset-px bg-gradient-to-r from-blue-600 to-cyan-500 rounded-none opacity-20 group-hover:opacity-30 transition-opacity" />
            <div className="relative bg-white p-8 rounded-none shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-none">
                  <Dna className="h-6 w-6 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 ml-4">
                  Visión
                </h2>
              </div>
              <p className="text-gray-600 leading-relaxed">{vision}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutUs;
