"use client";
import React from "react";

import HeroImagen from "@/components/customs/Features/HeroImage";

const HIGHLIGHT_COLOR = "#285C4D";

const Hero = () => {

  return (


        <HeroImagen
          title="Participa con Nosotros"
          subtitle="Descubre cómo formar parte de nuestra comunidad y aprovecha nuevas oportunidades para tu crecimiento."
          imageUrl="https://cdn.pixabay.com/photo/2019/04/03/03/05/medical-equipment-4099428_1280.jpg"
          primaryButton={{ text: "Comenzar ahora", link: "#", disabled: true }}
          secondaryButton={{ text: "Ver tour", link: "#", disabled: true }}
          overlayColor={HIGHLIGHT_COLOR}
          highlight="/highlights/Nosotros.png"
        />
  );
};

export default Hero;
