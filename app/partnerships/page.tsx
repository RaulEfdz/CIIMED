"use client"
// app/partnerships/page.tsx
import { BriefcaseBusiness, HandHeartIcon, HeartIcon } from "lucide-react";
import { HiAcademicCap } from "react-icons/hi";

import { motion } from "framer-motion";
import PartnershipCard from "./PartnershipCard";
import BenefitItem from "./BenefitItem";
import FormContact from "./FormContact";
import Hero from "./Hero";
import Testimonials from "./Testimonials";

export default function PartnershipsPage() {
  return (
    <motion.main
      className="min-h-screen bg-gradient-to-b bg-[#F2F2F2]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <Hero />
      <main className="max-w-6xl mx-auto px-4 w-full sm:px-6 py-16">
        <section className="mb-16">
          <div className="bg-[#285C4D] rounded-sm p-8 mb-12 text-center text-white">
            <h2 className="text-2xl font-semibold mb-4">¿Interesado en colaborar con nosotros?</h2>
            <p className="mb-6 max-w-3xl mx-auto">
              Únete a nuestra red de partners y accede a oportunidades exclusivas de I+D, recursos compartidos y proyectos innovadores.
            </p>
            <button className="bg-[#F4633A] text-white px-8 py-3 rounded-sm font-medium hover:bg-[#D35430] transition-colors">
              Solicitar información
            </button>
          </div>

          <h2 className="text-2xl font-bold text-[#212322] mb-8 border-l-4 border-[#F4633A] pl-4">Tipos de Colaboración</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <PartnershipCard icon={<BriefcaseBusiness className="h-6 w-6 text-[#f2f2f2]" />} title="Alianzas Corporativas" description="Colaboraciones estratégicas con empresas para desarrollo conjunto de tecnologías y transferencia de conocimiento." category="Industria" />
            <PartnershipCard icon={<HiAcademicCap className="h-6 w-6 text-[#f2f2f2]" />} title="Academia e Investigación" description="Cooperación con instituciones académicas para investigación básica y formación de talento especializado." category="Academia" />
            <PartnershipCard icon={<HeartIcon className="h-6 w-6 text-[#f2f2f2]" />} title="Organizaciones de Salud" description="Alianzas con hospitales y clínicas para estudios clínicos e implementación de nuevas terapias." category="Salud" />
            <PartnershipCard icon={<HandHeartIcon className="h-6 w-6 text-[#f2f2f2]" />} title="Organizaciones sin Fines de Lucro" description="Colaboraciones con ONGs y fundaciones para proyectos de impacto social y acceso a tratamientos." category="Impacto Social" />
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold text-[#212322] mb-8 border-l-4 border-[#285C4D] pl-4">Beneficios para Partners</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <BenefitItem title="Acceso Exclusivo" description="Prioridad en nuevos desarrollos y tecnologías emergentes" />
            <BenefitItem title="Recursos Compartidos" description="Uso de instalaciones especializadas y equipamiento de última generación" />
            <BenefitItem title="Visibilidad Global" description="Presencia conjunta en publicaciones científicas y eventos internacionales" />
          </div>
        </section>
        <FormContact />
        <Testimonials/>
      </main>
    </motion.main>
  );
}
