"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import HeroImagen from "@/components/customs/Features/HeroImage";
import ResearchCard from "@/app/research-areas/ResearchCard";
import { ResearchLine } from "@/app/research-areas/ResearchLine";

export type ResearchStatus =
  | "Completado"
  | "En curso"
  | "En reclutamiento"
  | "En análisis";

// Updated ResearchItem interface (you might need to adjust this in your actual page or types file)
export interface ResearchItem {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  status?: ResearchStatus; // Status is likely not needed anymore in this component
  type?: "project" | "investigation";
  categories?: string[]; // Added categories property as an array of strings (optional)
}

const researchItems: ResearchItem[] = [
  {
    id: 1,
    type: "project",
    title: "Desarrollo de una nueva terapia génica para la enfermedad X",
    description:
      "Este proyecto tiene como objetivo desarrollar una terapia génica innovadora para tratar la enfermedad X, una condición médica con necesidades insatisfechas.",
    imageUrl:
      "https://cdn.pixabay.com/photo/2018/11/20/16/44/laboratory-3827745_1280.jpg",
    status: "En curso",
  },
  {
    id: 2,
    type: "project",
    title:
      "Investigación sobre biomarcadores para la detección precoz del cáncer Y",
    description:
      "Esta investigación se centra en la identificación de nuevos biomarcadores que permitan la detección precoz del cáncer Y, mejorando las opciones de tratamiento.",
    imageUrl:
      "https://cdn.pixabay.com/photo/2018/11/20/16/44/laboratory-3827745_1280.jpg",
    status: "Completado",
  },
  {
    id: 3,
    type: "investigation",
    title: "Estudio clínico fase III sobre la eficacia del fármaco Z",
    description:
      "Un estudio clínico fase III para evaluar la eficacia y seguridad del fármaco Z en pacientes con la condición médica W.",
    imageUrl:
      "https://cdn.pixabay.com/photo/2018/11/20/16/44/laboratory-3827745_1280.jpg",
    status: "En reclutamiento",
  },
  {
    id: 4,
    type: "investigation",
    title: "Análisis genómico de cohortes de pacientes con enfermedades raras",
    description:
      "Esta investigación utiliza el análisis genómico para comprender mejor las bases genéticas de las enfermedades raras y identificar posibles dianas terapéuticas.",
    imageUrl:
      "https://cdn.pixabay.com/photo/2018/11/20/16/44/laboratory-3827745_1280.jpg",
    status: "En análisis",
  },
];

async function getResearchData() {
  return {
    projects: researchItems.filter((item) => item.type === "project"),
    investigations: researchItems.filter(
      (item) => item.type === "investigation"
    ),
  };
}



const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const Hero = () => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
  >
    <HeroImagen
      title="Investigación y Desarrollo"
      subtitle="Descubre nuestros proyectos innovadores y estudios en curso que están transformando el futuro de la medicina y la biotecnología."
      imageUrl="https://cdn.pixabay.com/photo/2017/10/04/09/56/laboratory-2815641_1280.jpg"
      primaryButton={{ text: "Comenzar ahora", link: "#", disabled: true }}
      secondaryButton={{ text: "Ver tour", link: "#", disabled: true }}
      overlayColor={"#285C4D"}
      highlight={"/highlights/LineasdeInvestigación.png"} 
    />
  </motion.div>
);

export default function ResearchPage() {
  // Estado para almacenar los datos y el estado de carga
  const [researchData, setResearchData] = useState<{
    projects: ResearchItem[];
    investigations: ResearchItem[];
  }>({ projects: [], investigations: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const data = await getResearchData();
      setResearchData(data);
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Cargando...</p>
      </div>
    );
  }

  const { projects, investigations } = researchData;

  return (
    <motion.main
      className="bg-[#F2F2F2] pb-24"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <Hero />
      <div className="max-w-6xl mx-auto px-4">
        <section className="">
          <ResearchLine />
        </section>

        <section >
        <p className="mb-4 text-sm uppercase tracking-wide text-[#212322] border-l-4 border-[#285C4D] pl-3">
         Proyectos
        </p>
        <h2 className="text-3xl font-semibold md:text-4xl border-l-4 text-[#212322]  border-[#285C4D] pl-3 mb-12">
            Investigación
          </h2>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid gap-6"
          >
            {projects.map((project) => (
              <ResearchCard key={project.id} item={project} />
            ))}
          </motion.div>
        </section>

        <section className="mt-28">
        <p className="mb-4 text-sm uppercase tracking-wide text-[#212322] border-l-4 border-[#285C4D] pl-3">
         Estudios
        </p>
        <h2 className="text-3xl font-semibold md:text-4xl border-l-4 text-[#212322]  border-[#285C4D] pl-3 mb-12">
          Clínicos
          </h2>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid gap-6"
          >
            {investigations.map((investigation) => (
              <ResearchCard key={investigation.id} item={investigation} />
            ))}
          </motion.div>
        </section>

        <section className="mt-28">
        <p className="mb-4 text-sm uppercase tracking-wide text-[#212322] border-l-4 border-[#285C4D] pl-3">
        Reconocimientos 
        </p>
        <h2 className="text-3xl font-semibold md:text-4xl border-l-4 text-[#212322]  border-[#285C4D] pl-3 mb-12">
        Logros y Reconocimientos
          </h2>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid gap-6"
          >
            {investigations.map((investigation) => (
              <ResearchCard key={investigation.id} item={investigation} />
            ))}
          </motion.div>
        </section>
      </div>
    </motion.main>
  );
}
