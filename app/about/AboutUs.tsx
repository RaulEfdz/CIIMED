"use client";

import React from "react";
import { themeColors } from "./data";
import AboutUsMissionVision from "./AboutUsMissionVision";
import { useInstitutionalInfo, getFeaturesFromInstitutional } from "@/hooks/useInstitutionalInfo";

const AboutUs: React.FC = () => {
  const { institutionalInfo, isLoading, error } = useInstitutionalInfo();
  
  // Obtener features dinámicos de la base de datos
  const dynamicFeatures = getFeaturesFromInstitutional(institutionalInfo);

  if (isLoading) {
    return (
      <div className="bg-gradient-to-b from-[#f2f2f2] via-white to-[#f2f2f2]" style={{ backgroundColor: themeColors.light }}>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="ml-3 text-gray-600">Cargando información institucional...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-b from-[#f2f2f2] via-white to-[#f2f2f2]" style={{ backgroundColor: themeColors.light }}>
        <div className="flex justify-center items-center h-64">
          <p className="text-red-600">Error al cargar la información: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-[#f2f2f2] via-white to-[#f2f2f2]" style={{ backgroundColor: themeColors.light }}>
      {/* AboutUsHero removido para evitar duplicación con Hero principal */}
      <AboutUsMissionVision features={dynamicFeatures} />
    </div>
  );
};

export default AboutUs;