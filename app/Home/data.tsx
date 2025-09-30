// data.ts
import { Microscope, Users } from "lucide-react";
import { ReactNode } from "react";
import { SiInstagram, SiLinkedin, SiSpotify, SiYoutube } from "react-icons/si";
import { UPLOADTHING_IMAGES } from "@/lib/uploadthing-utils";
import { InstitutionalInfo } from "@/hooks/useInstitutionalInfo";

export interface FeatureItem {
  text: string;
  bold: string;
  icon: ReactNode;
}

export interface FeatureData {
  imageUrl: string;
  imageAlt: string;
  title: string;
  description: string;
  features: FeatureItem[];
}

export interface SocialLink {
  icon: ReactNode;
  url: string;
  label: string;
}

export interface HeroBannerData {
  imageUrl: string;
  imageAlt: string;
  imgW: number;
  imgH: number;
  title: string;
  subtitle: string;
  actions: ReactNode;
  socialLinks: SocialLink[];
  overlayColor: string;
}

// Función para generar datos dinámicos de FeatureInit
export const generateFeatureInitData = (info: InstitutionalInfo | null): FeatureData => {
  if (!info) {
    // Valores por defecto si no hay datos
    return {
      imageUrl: UPLOADTHING_IMAGES.ABOUT_IMAGE,
      imageAlt: "medialImage",
      title: "CIIMED | Centro de Investigación e Innovación Médica",
      description: "El Centro de Investigación e Innovación Médica es una iniciativa clave en Panamá, ubicada en la Ciudad de la Salud...",
      features: [
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
      ],
    }
  }

  return {
    imageUrl: info.image || UPLOADTHING_IMAGES.ABOUT_IMAGE,
    imageAlt: "medialImage",
    title: info.name,
    description: info.description,
    features: [
      ...(info.feature1Title && info.feature1Text ? [{
        text: info.feature1Text,
        bold: info.feature1Title,
        icon: <Microscope className="w-6 h-6 text-primary" />,
      }] : []),
      ...(info.feature2Title && info.feature2Text ? [{
        text: info.feature2Text,
        bold: info.feature2Title,
        icon: <Users className="w-6 h-6 text-primary" />,
      }] : []),
    ],
  }
};

// Función para generar datos dinámicos de HeroSection
export const generateHeroSectionData = (info: InstitutionalInfo | null): HeroBannerData => {
  if (!info) {
    // Valores por defecto si no hay datos
    return {
      imageUrl: UPLOADTHING_IMAGES.ABOUT_IMAGE,
      imageAlt: "CIIMED Banner",
      imgW: 2080,
      imgH: 1365,
      title: "CIIMED | Centro de Investigación e Innovación Médica",
      subtitle: "Un referente en investigación y desarrollo en salud en Panamá",
      actions: <></>,
      socialLinks: [
        {
          icon: <SiInstagram />,
          url: "https://www.instagram.com/ciimedpanama/",
          label: "",
        },
        {
          icon: <SiLinkedin />,
          url: "https://www.linkedin.com/company/ciimed/posts/?feedView=all",
          label: "",
        },
        {
          icon: <SiYoutube/>,
          url: "https://www.youtube.com/channel/UCw525jjoG_HssaCxp4XJRow",
          label: "",
        },
        {
          icon: <SiSpotify />,
          url: "https://open.spotify.com/show/6rPGtfqkc8iOK80k6KtyHD",
          label: "",
        },
      ],
      overlayColor: "#ffffff",
    }
  }

  const socialLinks: SocialLink[] = []
  
  if (info.instagramUrl) {
    socialLinks.push({
      icon: <SiInstagram />,
      url: info.instagramUrl,
      label: "",
    })
  }
  
  if (info.linkedinUrl) {
    socialLinks.push({
      icon: <SiLinkedin />,
      url: info.linkedinUrl,
      label: "",
    })
  }
  
  if (info.youtubeUrl) {
    socialLinks.push({
      icon: <SiYoutube />,
      url: info.youtubeUrl,
      label: "",
    })
  }
  
  if (info.spotifyUrl) {
    socialLinks.push({
      icon: <SiSpotify />,
      url: info.spotifyUrl,
      label: "",
    })
  }

  return {
    imageUrl: info.image || UPLOADTHING_IMAGES.ABOUT_IMAGE,
    imageAlt: "CIIMED Banner",
    imgW: 2080,
    imgH: 1365,
    title: info.name,
    subtitle: info.subtitle || info.description,
    actions: <></>,
    socialLinks,
    overlayColor: info.overlayColor || "#ffffff",
  }
};