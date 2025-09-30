import { SingleImage } from "@/components/customs/Features/SingleImage";
import { motion } from "framer-motion";
import { generateFeatureInitData } from "./data";
import { useInstitutionalInfo } from "@/hooks/useInstitutionalInfo";

export const FeatureInit = () => {
  const { institutionalInfo, isLoading } = useInstitutionalInfo();
  
  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const featureData = generateFeatureInitData(institutionalInfo);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
      className="flex flex-col items-center justify-center p-6"
    >
      <SingleImage {...featureData} />
    </motion.div>
  );
};