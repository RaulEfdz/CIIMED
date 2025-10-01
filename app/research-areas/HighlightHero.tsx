// components/HighlightHero.tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import HeroImagen from "@/components/customs/Features/HeroImage";
import { selectSingleSafe } from "../api/tools/actions/selectSingleSafe";

// Definición del tipo que representa el registro obtenido de Supabase
interface HighlightRecord {
  id: string;
  page: string;
  section: string;
  data: {
    title: string;
    mainImage: string;
    description: string;
    backgroundImage: string;
  };
}

const HighlightHero = () => {
  const [highlight, setHighlight] = useState<HighlightRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHighlight() {
      // Se utiliza la función selectSingle para obtener el registro con page === "Highlight"
      const result = await selectSingleSafe<HighlightRecord>("cms", "page", "Highlight");
      setHighlight(result);
      setLoading(false);
    }
    fetchHighlight();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <HeroImagen
        title={loading || !highlight ? "mock mock mock" : highlight.data.title}
        subtitle={loading || !highlight ? "mock mock mock" : highlight.data.description}
        // Se utiliza backgroundImage o mainImage según disponibilidad
        imageUrl={loading || !highlight ? "/logo.png" : highlight.data.mainImage}
        primaryButton={{ text: "Comenzar ahora", link: "#", disabled: true }}
        secondaryButton={{ text: "Ver tour", link: "#", disabled: true }}
        overlayColor={"#285C4D"}
        highlight={
          loading || !highlight
            ? "/highlights/LineasdeInvestigación.png"
            : highlight.data.backgroundImage
        }
      />
    </motion.div>
  );
};

export default HighlightHero;
