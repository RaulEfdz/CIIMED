// data.ts

import { Dna, FlaskConical, GraduationCap, HeartPulse, Users } from "lucide-react";
import { UPLOADTHING_IMAGES } from "@/lib/uploadthing-utils";

export interface Achievement {
    icon: React.ElementType;
    title: string;
    value: string;
    description: string;
  }
  
  export interface Feature {
    id: string;
    title: string;
    description: string;
    icon: React.ElementType;
    imageUrl: string;
  }
  
  export interface HistoryData {
    description: string;
    objectives: string[];
  }
  
  export interface HeroButton {
    text: string;
    link: string;
    disabled: boolean;
  }
  
  export const themeColors = {
    primary: "#285C4D",
    secondary: "#F4633A",
    dark: "#212322",
    light: "#f2f2f2",
  };
  
  export const achievements: Achievement[] = [
    {
      icon: FlaskConical,
      title: "Investigaciones",
      value: "150+",
      description: "Proyectos de investigación completados",
    },
    {
      icon: Users,
      title: "Pacientes",
      value: "10000+",
      description: "Personas beneficiadas",
    },
    {
      icon: GraduationCap,
      title: "Publicaciones",
      value: "75+",
      description: "Artículos científicos publicados",
    },
  ];
  
  export const features: Feature[] = [
    {
      id: "1",
      title: "Misión",
      description:
        "Nuestra misión es impulsar la innovación y la excelencia en el sector médico, proporcionando soluciones efectivas y avanzadas.",
      icon: HeartPulse,
      imageUrl: UPLOADTHING_IMAGES.ABOUT_IMAGE,
    },
    {
      id: "2",
      title: "Visión",
      description:
        "Nuestra visión es ser líderes en la investigación y desarrollo de nuevas tecnologías para mejorar la calidad de vida de las personas.",
      icon: Dna,
      imageUrl: UPLOADTHING_IMAGES.ABOUT_IMAGE,
    },
  ];
  
  export const historyData: HistoryData = {
    description:
      "Historia del Centro de Investigación e Innovación Médica. El CIIM se ha posicionado como un referente en la investigación científica y la innovación en el ámbito de la salud en Panamá. Este centro, inaugurado recientemente, busca abordar las necesidades de salud pública a través de la investigación avanzada y la colaboración con diversas instituciones.",
    objectives: [
      "Proporcionar un entorno propicio para que médicos y científicos desarrollen proyectos de investigación que beneficien a la comunidad local e internacional.",
      "Fortalecer la capacidad investigativa en el país, especialmente en áreas críticas como enfermedades crónicas y salud pública.",
    ],
  };
  
  export const heroData = {
    title: "Sobre Nosotros",
    subtitle: "CIIMED es un centro de investigación líder en el desarrollo de innovaciones médicas y científicas.",
    imageUrl: UPLOADTHING_IMAGES.ABOUT_IMAGE,
    primaryButton: { text: "Comenzar ahora", link: "#", disabled: true },
    secondaryButton: { text: "Ver tour", link: "#", disabled: true },
    overlayColor: "#285C4D",
    highlight: "/highlights/Nosotros.png",
  };