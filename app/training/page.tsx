"use client";

import { motion } from "framer-motion";
import HeroImagen from "@/components/customs/Features/HeroImage";
import CourseSection from "./TrainingCrads";
import HireUs from "@/components/customs/feedBack/HireUs";

 const HIGHLIGHT_COLOR = "#285C4D";

const Hero = () => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
  >
    <HeroImagen
      title="Formación y Capacitación"
      subtitle="Programa de formación continua para profesionales de la salud e investigadores. Mejora tus habilidades con nuestros cursos certificados."
      imageUrl="https://cdn.pixabay.com/photo/2017/10/04/09/56/chemist-2815640_1280.jpg"
      primaryButton={{ text: "Comenzar ahora", link: "#", disabled: true }}
      secondaryButton={{ text: "Ver tour", link: "#", disabled: true }}
      overlayColor={HIGHLIGHT_COLOR}
      highlight="/highlights/Procesos.png"
    />
  </motion.div>
);

const FormContact=()=>{
  const content = {
    title: "Consulta con CIIMED | Centro de Investigación e Innovación Médica",
    subtitle:
      "Resuelve tus dudas sobre nuestros proyectos y servicios de investigación",
    description:
      "En CIIMED, ofrecemos información detallada sobre nuestras investigaciones y colaboraciones. Si tienes preguntas sobre nuestros proyectos, tecnologías médicas o deseas conocer más sobre oportunidades de participación, contáctanos.",
    expectations: [
      "Información sobre nuestras líneas de investigación",
      "Asesoría en proyectos científicos y tecnológicos",
      "Oportunidades de colaboración con el centro"
    ],
    form: {
      title: "Haz tu consulta",
      namePlaceholder: "Nombre",
      lastNamePlaceholder: "Apellido",
      emailPlaceholder: "Correo Electrónico",
      messagePlaceholder: "Tu consulta",
      submitButton: "Enviar consulta"
    }
  };
  return <HireUs content={content} />;
}

const TrainingPage = () => (
  <motion.main
    className="min-h-screen bg-gradient-to-b bg-[#F2F2F2]"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.6 }}
  >
    <Hero />
    <main className="max-w-7xl mx-auto px-4 w-full sm:px-6 py-16">
      <CourseSection />
      <FormContact/>
    </main>
  </motion.main>
);

export default TrainingPage;