"use client";

import {
  Microscope,
  Dna,
  Cog,
  BarChart,
  Brain,
  Syringe,
} from "lucide-react";
import { JSX } from "react";

interface Feature {
  title: string;
  description: string;
  icon: JSX.Element;
}

interface ResearchLineProps {
  heading?: string;
  subheading?: string;
  features?: Feature[];
}

export const ResearchLine = ({
  heading = "Líneas de Investigación",
  subheading = "Áreas de enfoque",
  features = [
    {
      title: "Investigación Clínica y Biomédica",
      description:
        "Exploramos nuevas terapias, medicamentos y enfoques médicos para mejorar el tratamiento de diversas enfermedades.",
      icon: <Microscope className="size-5 md:size-7 text-[#285c4d]" />,
    },
    {
      title: "Medicina Personalizada y Genómica",
      description:
        "Analizamos el impacto de la genética en la salud y la enfermedad, desarrollando tratamientos personalizados.",
      icon: <Dna className="size-5 md:size-7 text-[#285c4d]" />,
    },
    {
      title: "Tecnologías Médicas e Innovación",
      description:
        "Desarrollamos y evaluamos dispositivos médicos e inteligencia artificial aplicada a la salud.",
      icon: <Cog className="size-5 md:size-7 text-[#285c4d]" />,
    },
    {
      title: "Salud Pública y Epidemiología",
      description:
        "Estudiamos factores que afectan la salud de la población, con énfasis en enfermedades infecciosas y prevención.",
      icon: <BarChart className="size-5 md:size-7 text-[#285c4d]" />,
    },
    {
      title: "Neurociencia y Salud Mental",
      description:
        "Investigamos trastornos neurológicos y psiquiátricos, desarrollando enfoques innovadores para su tratamiento.",
      icon: <Brain className="size-5 md:size-7 text-[#285c4d]" />,
    },
    {
      title: "Biotecnología y Desarrollo de Vacunas",
      description:
        "Trabajamos en la investigación y producción de nuevas vacunas y terapias biotecnológicas.",
      icon: <Syringe className="size-5 md:size-7 text-[#285c4d]" />,
    },
  ],
}: ResearchLineProps) => {
  return (
    <section className="py-24  text-white">
      <div className="container mx-auto max-w-6xl px-6">
        <p className="mb-4 text-sm uppercase tracking-wide text-[#212322] border-l-4 border-[#285C4D] pl-3">
          {subheading}
        </p>
        <h2 className="text-3xl font-semibold md:text-4xl border-l-4 text-[#212322]  border-[#285C4D] pl-3 mb-12">
          {heading}
        </h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="flex flex-col items-start p-6 bg-[#285C4D] rounded-sm shadow-md hover:shadow-lg transition"
            >
              <div className="flex items-center justify-center size-12 rounded-full bg-[#f2f2f2] mb-4 ">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
