// data.ts
import { ReactNode } from "react";
import { BriefcaseBusiness, HandHeartIcon, HeartIcon } from "lucide-react";
import { HiAcademicCap } from "react-icons/hi";

export interface ButtonData {
  text: string;
  link: string;
  disabled: boolean;
}

export interface HeroData {
  title: string;
  subtitle: string;
  imageUrl: string;
  primaryButton: ButtonData;
  secondaryButton: ButtonData;
  overlayColor: string;
  highlight: string;
}

export interface FormData {
  title: string;
  namePlaceholder: string;
  lastNamePlaceholder: string;
  emailPlaceholder: string;
  messagePlaceholder: string;
  submitButton: string;
}

export interface HireUsContent {
  title: string;
  subtitle: string;
  description: string;
  expectations: string[];
  form: FormData;
}

export interface PartnershipCardData {
  icon: ReactNode;
  title: string;
  description: string;
  category: string;
}

export interface BenefitItemData {
  title: string;
  description: string;
}

export interface Testimonial {
  id: number;
  name: string;
  position: string;
  company: string;
  logo: string;
  message: string;
}

export const heroPartnershipsData: HeroData = {
  title: "Alianzas Estratégicas",
  subtitle: "Colaboramos con organizaciones innovadoras para impulsar avances científicos y tecnológicos que transformen el futuro de la salud.",
  imageUrl: "https://cdn.pixabay.com/photo/2017/02/01/13/52/analysis-2030261_1280.jpg",
  primaryButton: { text: "Comenzar ahora", link: "#", disabled: true },
  secondaryButton: { text: "Ver tour", link: "#", disabled: true },
  overlayColor: "#285C4D",
  highlight: "/highlights/Comunidad.png",
};

export const allianceContent: HireUsContent = {
  title: "Solicitud de Alianza | Centro de Alianzas Estratégicas",
  subtitle: "Impulsa la innovación a través de colaboraciones estratégicas",
  description:
    "En nuestro centro buscamos socios comprometidos para desarrollar proyectos innovadores que generen un impacto positivo en la industria. Si estás interesado en formar parte de nuestras alianzas, completa la siguiente solicitud.",
  expectations: [
    "Colaboración en proyectos conjuntos",
    "Acceso a recursos y experiencia especializada",
    "Oportunidades de networking y crecimiento mutuo",
  ],
  form: {
    title: "Solicita tu Alianza",
    namePlaceholder: "Nombre",
    lastNamePlaceholder: "Apellido",
    emailPlaceholder: "Correo Electrónico",
    messagePlaceholder: "Describe tu propuesta",
    submitButton: "Enviar Solicitud",
  },
};

export const partnershipCardsData: PartnershipCardData[] = [
  {
    icon: <BriefcaseBusiness className="h-6 w-6 text-[#f2f2f2]" />,
    title: "Alianzas Corporativas",
    description:
      "Colaboraciones estratégicas con empresas para desarrollo conjunto de tecnologías y transferencia de conocimiento.",
    category: "Industria",
  },
  {
    icon: <HiAcademicCap className="h-6 w-6 text-[#f2f2f2]" />,
    title: "Academia e Investigación",
    description:
      "Cooperación con instituciones académicas para investigación básica y formación de talento especializado.",
    category: "Academia",
  },
  {
    icon: <HeartIcon className="h-6 w-6 text-[#f2f2f2]" />,
    title: "Organizaciones de Salud",
    description:
      "Alianzas con hospitales y clínicas para estudios clínicos e implementación de nuevas terapias.",
    category: "Salud",
  },
  {
    icon: <HandHeartIcon className="h-6 w-6 text-[#f2f2f2]" />,
    title: "Organizaciones sin Fines de Lucro",
    description:
      "Colaboraciones con ONGs y fundaciones para proyectos de impacto social y acceso a tratamientos.",
    category: "Impacto Social",
  },
];

export const benefitItemsData: BenefitItemData[] = [
  {
    title: "Acceso Exclusivo",
    description: "Prioridad en nuevos desarrollos y tecnologías emergentes",
  },
  {
    title: "Recursos Compartidos",
    description: "Uso de instalaciones especializadas y equipamiento de última generación",
  },
  {
    title: "Visibilidad Global",
    description: "Presencia conjunta en publicaciones científicas y eventos internacionales",
  },
];

export const testimonialsData: Testimonial[] = [
  {
    id: 1,
    name: "Nicole Grazioso",
    position: "Director Payments & Risk",
    company: "HubSpot",
    logo: "/logo.png",
    message:
      "I'm absolutely floored by the level of care and attention to detail the team at HS have put into this theme and for one can guarantee that I will be a return customer.",
  },
  {
    id: 2,
    name: "Josh Tyson",
    position: "Product Manager",
    company: "Capsule",
    logo: "/logo.png",
    message:
      "With Preline, we’re able to easily track our performance in full detail. It’s become an essential tool for us to grow and engage with our audience.",
  },
  {
    id: 3,
    name: "Luisa",
    position: "Senior Director of Operations",
    company: "Fitbit",
    logo: "/logo.png",
    message:
      "In September, I will be using this theme for 2 years. I went through multiple updates and changes and I’m very glad to see the consistency and effort made by the team.",
  },
];