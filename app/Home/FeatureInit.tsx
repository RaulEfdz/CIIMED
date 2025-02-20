import { SingleImage } from "@/components/customs/Features/SingleImage";
import { motion } from "framer-motion";
import { Microscope, Users } from "lucide-react";

export const FeatureInit = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
      className="flex flex-col items-center justify-center p-6"
    >
      <SingleImage
        imageUrl="jcue8atmcjfv9aea2sw0"
        imageAlt="medialImage"
        title="CIIMED | Centro de Investigación e Innovación Médica"
        description="El Centro de Investigación e Innovación Médica es una iniciativa clave en Panamá, ubicada en la Ciudad de la Salud..."
        features={[
          {
            text: "El centro está enfocado en el estudio de nuevas tecnologías, medicamentos, vacunas y dispositivos médicos...",
            bold: "Investigación Avanzada",
            icon: <Microscope className="w-6 h-6 text-primary" />,
          },
          {
            text: "Trabaja de manera conjunta con instituciones como la Secretaría Nacional de Ciencia, Tecnología e Innovación (SENACYT)...",
            bold: "Colaboraciones Estratégicas",
            icon: <Users className="w-6 h-6 text-primary" />,
          },
        ]}
      />
    </motion.div>
  );
};
