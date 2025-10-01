"use client";

import { useState, useEffect } from "react";
import { JSX } from "react";
import { selectSingleSafe } from "../api/tools/actions/selectSingleSafe";

interface Feature {
  title: string;
  description: string;
  icon: JSX.Element;
}

interface ResearchLineProps {
  heading?: string;
  subheading?: string;
  // Permite pasar features por defecto opcionalmente
  defaultFeatures?: Feature[];
}

// Tipo para la data que llega desde Supabase
interface ResearchLineRecord {
  id: string;
  page: string;
  section: string;
  data: {
    lines: {
      icon: string; // En la tabla se envía como emoji (string)
      title: string;
      description: string;
    }[];
    title: string;
  };
}

export const ResearchLine = ({
  heading,
  subheading,
  defaultFeatures = [],
}: ResearchLineProps) => {
  const [features, setFeatures] = useState<Feature[]>(defaultFeatures);
  const [currentHeading, setCurrentHeading] = useState<string>(
    heading || "Líneas de Investigación"
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      // Se obtiene el registro donde page === "Research Focus"
      const record = await selectSingleSafe<ResearchLineRecord>(
        "cms",
        "page",
        "ResearchLine"
      );
      if (record) {
        console.log(record);
        // Mapea cada línea a la estructura Feature, convirtiendo el icono (emoji) en JSX
        const mappedFeatures: Feature[] = record.data.lines.map((line) => ({
          title: line.title,
          description: line.description,
          icon: <span className="text-2xl">{line.icon}</span>,
        }));
        setFeatures(mappedFeatures);
        setCurrentHeading(record.data.title);
      }
      setIsLoading(false);
    }
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <p>Cargando áreas de enfoque...</p>
      </div>
    );
  }

  return (
    <section className="py-24 text-white">
      <div className="container mx-auto max-w-6xl px-6">
        <p className="mb-4 text-sm uppercase tracking-wide text-[#212322] border-l-4 border-[#285C4D] pl-3">
          {subheading || "Áreas de enfoque"}
        </p>
        <h2 className="text-3xl font-semibold md:text-4xl border-l-4 text-[#212322] border-[#285C4D] pl-3 mb-12">
          {currentHeading}
        </h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="flex flex-col items-start p-6 bg-[#285C4D] rounded-sm shadow-md hover:shadow-lg transition"
            >
              <div className="flex items-center justify-center size-12 rounded-full bg-[#f2f2f2] mb-4">
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
