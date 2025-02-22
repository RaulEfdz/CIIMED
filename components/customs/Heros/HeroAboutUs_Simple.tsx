"use client";
import React from "react";
import { Briefcase, Building2 } from "lucide-react";
import { CldImage } from "next-cloudinary";

// Definición de las propiedades del componente
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
  imageUrl,
  imageAlt,
  imgW,
  imgH,
  mission,
  vision,
}) => {
  return (
    <div className="h-auto bg-gradient-to-br from-gray-50 to-gray-100 p-10 pb-16">
      {/* Contenedor principal */}
      <div className="max-w-7xl mx-auto">
        {/* Layout flexible: texto e imagen */}
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Sección de texto */}
          <div className="lg:w-1/2 space-y-8">
            {/* Título principal con animación */}
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight transition-all duration-300 hover:text-blue-600">
              {title}
            </h1>

            {/* Descripción con énfasis en palabras clave */}
            <p className="text-lg text-gray-600">
              <span className="font-semibold text-blue-600">CIIMED</span> es un{" "}
              <span className="font-semibold text-blue-600">
                centro de investigación líder
              </span>{" "}
              en el desarrollo de innovaciones médicas y científicas.
            </p>

            {/* Misión y Visión con hover y animaciones */}
            <div className="pt-8 border-t border-gray-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Misión */}
                <div className="bg-[#F2F2F2] p-6 rounded-sm shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300">
                  <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-blue-600" /> Misión
                  </h2>
                  <p className="text-gray-600">{mission}</p>
                </div>

                {/* Visión */}
                <div className="bg-[#F2F2F2] p-6 rounded-sm shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300">
                  <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-blue-600" /> Visión
                  </h2>
                  <p className="text-gray-600">{vision}</p>
                </div>
              </div>
            </div>

            {/* Botón CTA */}
            <div className="mt-8">
              <a
                href="/contact"
                className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-sm shadow-md hover:bg-blue-700 transition-all"
              >
                Conócenos más
              </a>
            </div>
          </div>

          {/* Imagen destacada con animación de entrada */}
          <div className="lg:w-1/2">
            <CldImage
              className="w-full h-auto rounded-sm shadow-lg transition-transform duration-300 hover:scale-105 opacity-0 animate-fade-in"
              src={imageUrl}
              alt={imageAlt}
              width={imgW}
              height={imgH}
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default AboutUs;
