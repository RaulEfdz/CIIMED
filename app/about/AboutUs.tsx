"use client";

import React from "react";
import AboutUsHero from "./AboutUsHero";
import AboutUsMissionVision from "./AboutUsMissionVision";
import { HeartPulse, Dna } from "lucide-react";

const themeColors = {
  primary: "#285C4D",
  secondary: "#F4633A",
  dark: "#212322",
  light: "#f2f2f2",
};

const features = [
  {
    id: "1",
    title: "Misión",
    description:
      "Nuestra misión es impulsar la innovación y la excelencia en el sector médico, proporcionando soluciones efectivas y avanzadas.",
    icon: HeartPulse,
    imageUrl: "https://res.cloudinary.com/doyfs0fiu/image/upload/v1738373133/kjc0pnawxekjyvmoga4a.jpg",
  },
  {
    id: "2",
    title: "Visión",
    description:
      "Nuestra visión es ser líderes en la investigación y desarrollo de nuevas tecnologías para mejorar la calidad de vida de las personas.",
    icon: Dna,
    imageUrl: "https://res.cloudinary.com/doyfs0fiu/image/upload/v1738280298/jcue8atmcjfv9aea2sw0.jpg",
  },
];

const AboutUs: React.FC = () => {
  return (
    <div className="bg-gradient-to-b from-[#f2f2f2] via-white to-[#f2f2f2]" style={{ backgroundColor: themeColors.light }}>
      <AboutUsHero />
      <AboutUsMissionVision features={features} />
    </div>
  );
};

export default AboutUs;
