import { SingleImage } from "@/components/customs/Features/SingleImage";
import { motion } from "framer-motion";
import { featureInitData } from "./data"; // Importar datos

export const FeatureInit = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
      className="flex flex-col items-center justify-center p-6"
    >
      <SingleImage {...featureInitData} /> { /* Usar datos importados */ }
    </motion.div>
  );
};