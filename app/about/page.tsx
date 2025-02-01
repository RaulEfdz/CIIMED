"use client";

import AboutUs from "@/components/customs/Heros/HeroAboutUs";

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
