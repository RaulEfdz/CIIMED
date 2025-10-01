"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { FlaskConical, Users, GraduationCap } from "lucide-react";
import { useInstitutionalInfo, getAchievementsFromInstitutional } from "@/hooks/useInstitutionalInfo";

const AboutUsHero: React.FC = () => {
  const { institutionalInfo, isLoading } = useInstitutionalInfo();
  
  // Obtener estadísticas dinámicas de la base de datos
  const dynamicAchievements = getAchievementsFromInstitutional(institutionalInfo);

  // Mapeo de iconos
  const iconMap = {
    FlaskConical,
    Users,
    GraduationCap,
  };

  if (isLoading) {
    return (
      <section className="max-w-7xl mx-auto px-6 pt-0 pb-10">
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="rounded-sm shadow-sm p-6 bg-[#f2f2f2] animate-pulse">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-sm bg-gray-300 w-12 h-12"></div>
                <div className="flex-1">
                  <div className="h-8 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-6 pt-0 pb-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="grid md:grid-cols-3 gap-6"
      >
        {dynamicAchievements.map((achievement, index) => {
          const IconComponent = iconMap[achievement.icon as keyof typeof iconMap];
          return (
            <Card
              key={index}
              className="rounded-sm shadow-sm p-6 flex items-center gap-4 bg-[#f2f2f2]"
            >
              <div className="p-3 rounded-sm bg-[#F4633A]">
                {IconComponent && <IconComponent className="w-6 h-6 text-white" />}
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">
                  {achievement.value}
                </div>
                <div className="text-sm font-medium text-gray-700">
                  {achievement.description}
                </div>
              </div>
            </Card>
          );
        })}
      </motion.div>
    </section>
  );
};

export default AboutUsHero;