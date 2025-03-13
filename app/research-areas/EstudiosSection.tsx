"use client";

import { useState, useEffect } from "react";
import ResearchCard from "@/app/research-areas/ResearchCard";
import { motion } from "framer-motion";
import { ResearchItem } from "./ProyectosSection"; // Reutilizamos la misma interfaz
import { selectSingle } from "../api/tools/actions/selectSingle";

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

const EstudiosSection = () => {
  const [items, setItems] = useState<ResearchItem[]>([]);
  const [heading, setHeading] = useState<string>("Estudios");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const record = await selectSingle<ResearchSectionRecord>(
        "cms",
        "page",
        "Estudios"
      );
      if (record) {
        setHeading(record.data.title);
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
        <p>Cargando Estudios...</p>
      </div>
    );
  }

  return (
    <section className="mt-28">
      <p className="mb-4 text-sm uppercase tracking-wide text-[#212322] border-l-4 border-[#285C4D] pl-3">
        Estudios
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

export default EstudiosSection;
