"use client";

import React from "react";
import AboutUs from "@/components/customs/Heros/AboutUs_Tecnology";
import HistoryHero from "@/components/customs/Features/HistoryHero";

const About = () => {
  return (
    <>
      <AboutUs
        title="Sobre Nosotros"
        description="CIIMED es un centro de investigación líder en el desarrollo de innovaciones médicas y científicas."
        imageUrl="jcue8atmcjfv9aea2sw0"
        imageAlt="Equipo de investigación en CIIMED"
        imgW={2048}
        imgH={1365}
        mission="Somos un centro líder en investigación médica, comprometido con la excelencia científica y la innovación en salud pública. Nuestra misión es generar conocimiento y evidencia científica de alta calidad para influir en políticas de salud y mejorar el bienestar global."
        vision="Ser el centro de referencia en investigación y desarrollo de tecnologías médicas en América Latina."
      />

      <HistoryHero
        title="Historia"
        subtitle="Centro de Investigación e Innovación Médica"
        description="Somos un centro líder en investigación médica, comprometido con la excelencia científica y la innovación en salud pública."
        imageUrl="jcue8atmcjfv9aea2sw0"
        imageAlt="CIIMED Instalaciones"
        imgW={800}
        imgH={600}
        foundation={{
          description:
            "Historia del Centro de Investigación e Innovación Médica. El Centro de Investigación e Innovación Médica (CIIM) es una institución que se ha posicionado como un referente en la investigación científica y la innovación en el ámbito de la salud en Panamá. Este centro, inaugurado recientemente, busca abordar las necesidades de salud pública a través de la investigación avanzada y la colaboración con diversas instituciones.",
          objectives: [
            "El CIIM fue creado con el objetivo de proporcionar un entorno propicio para que los médicos y científicos desarrollen proyectos de investigación que beneficien tanto a la comunidad local como al panorama internacional.",
            "La iniciativa responde a la necesidad de fortalecer la capacidad investigativa en el país, especialmente en áreas críticas como enfermedades crónicas y salud pública.",
          ],
        }}
        researchLines={[
          {
            title: "Enfermedades Crónicas",
            description: "Investigaciones sobre condiciones prevalentes en la población panameña.",
          },
          {
            title: "Salud Pública",
            description: "Proyectos destinados a mejorar las políticas y prácticas de salud en comunidades vulnerables.",
          },
          {
            title: "Innovación Tecnológica",
            description: "Desarrollo de nuevas tecnologías aplicadas a la medicina y rehabilitación.",
          },
        ]}
        collaborations={[
          "El CIIM trabaja en estrecha colaboración con importantes entidades, como la Secretaría Nacional de Ciencia, Tecnología e Innovación (SENACYT), universidades locales y otros centros de investigación.",
          "Estas alianzas permiten el intercambio de conocimientos y recursos, facilitando el desarrollo de estudios multidisciplinarios.",
        ]}
        impact="A lo largo de su trayectoria, el CIIM ha logrado posicionarse como un centro clave para la producción científica en Panamá. Ha contribuido significativamente al conocimiento médico a través de publicaciones en revistas internacionales y ha participado activamente en conferencias científicas."
        future="El futuro del CIIM se centra en continuar expandiendo su capacidad investigativa, buscando financiamiento adicional y apoyo del sector privado. La meta es seguir generando conocimiento que pueda influir en políticas públicas y mejorar la salud de la población panameña."
      />
    </>
  );
};

export default function AboutPage() {
  return (
    <section className="mt-20">
      <About />
    </section>
  );
}
