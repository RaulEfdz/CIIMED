"use client";

import { useState, useEffect } from "react";
import ResearchCard from "@/app/research-areas/ResearchCard";
import { motion } from "framer-motion";
import { selectSingle } from "../api/tools/actions/selectSingle";

// Se reutiliza la interfaz ResearchItem (puedes ajustar los campos según lo que necesite ResearchCard)
export interface ResearchItem {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  status?: string;
  type?: "project" | "investigation";
  categories?: string[];
}

// Interfaz para la data que llega desde Supabase para una sección
interface ResearchSectionRecord {
  id: string;
  page: string;
  section: string;
  data: {
    items: {
      title: string;
      category: string;
      description: string;
      mainImage: string,
    }[];
    title: string;
  };
}

const ProyectosSection = () => {
  const [items, setItems] = useState<ResearchItem[]>([]);
  const [heading, setHeading] = useState<string>("Proyectos");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const record = await selectSingle<ResearchSectionRecord>(
        "cms",
        "page",
        "Proyectos"
      );
      if (record) {
        setHeading(record.data.title);
        // Mapea cada item de CMS a un ResearchItem (se asigna un placeholder para imageUrl)
        const mappedItems: ResearchItem[] = record.data.items.map((item, index) => ({
          id: index,
          title: item.title,
          description: item.description,
          imageUrl:!item ? "/logo.png" : item.mainImage,
          categories: [item.category],
        }));
        setItems(mappedItems);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <p>Cargando Proyectos...</p>
      </div>
    );
  }

  return (
    <section>
      <p className="mb-4 text-sm uppercase tracking-wide text-[#212322] border-l-4 border-[#285C4D] pl-3">
        Proyectos
      </p>
      <h2 className="text-3xl font-semibold md:text-4xl border-l-4 text-[#212322] border-[#285C4D] pl-3 mb-12">
        {heading}
      </h2>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-6"
      >
        {items.map((item) => (
          <ResearchCard key={item.id} item={item} />
        ))}
      </motion.div>
    </section>
  );
};

export default ProyectosSection;
