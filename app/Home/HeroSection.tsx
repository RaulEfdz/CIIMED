import HeroBanner from "@/components/customs/Heros/HeroBanner";
import { motion } from "framer-motion";
import { generateHeroSectionData } from "./data";
import { useInstitutionalInfo } from "@/hooks/useInstitutionalInfo";

export const HeroSection = () => {
  const { institutionalInfo, isLoading } = useInstitutionalInfo();
  
  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const heroData = generateHeroSectionData(institutionalInfo);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <HeroBanner {...heroData} />
    </motion.div>
  );
};