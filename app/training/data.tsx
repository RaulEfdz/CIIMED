// data.ts

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

export interface CourseCardData {
  imageUrl: string;
  title: string;
  description: string;
  duration: string;
  modality: string;
  category: string;
}

export const heroTrainingData: HeroData = {
  title: "Formación y Capacitación",
  subtitle:
    "Programa de formación continua para profesionales de la salud e investigadores. Mejora tus habilidades con nuestros cursos certificados.",
  imageUrl:
    "https://cdn.pixabay.com/photo/2017/10/04/09/56/chemist-2815640_1280.jpg",
  primaryButton: { text: "Comenzar ahora", link: "#", disabled: true },
  secondaryButton: { text: "Ver tour", link: "#", disabled: true },
  overlayColor: "#285C4D",
  highlight: "/highlights/Procesos.png",
};

export const trainingContactContent: HireUsContent = {
  title: "Consulta con CIIMED | Centro de Investigación e Innovación Médica",
  subtitle:
    "Resuelve tus dudas sobre nuestros proyectos y servicios de investigación",
  description:
    "En CIIMED, ofrecemos información detallada sobre nuestras investigaciones y colaboraciones. Si tienes preguntas sobre nuestros proyectos, tecnologías médicas o deseas conocer más sobre oportunidades de participación, contáctanos.",
  expectations: [
    "Información sobre nuestras líneas de investigación",
    "Asesoría en proyectos científicos y tecnológicos",
    "Oportunidades de colaboración con el centro",
  ],
  form: {
    title: "Haz tu consulta",
    namePlaceholder: "Nombre",
    lastNamePlaceholder: "Apellido",
    emailPlaceholder: "Correo Electrónico",
    messagePlaceholder: "Tu consulta",
    submitButton: "Enviar consulta",
  },
};

export const coursesData: CourseCardData[] = [
  {
    imageUrl:
      "https://cdn.pixabay.com/photo/2017/10/04/09/56/chemist-2815640_1280.jpg",
    title: "Biotecnología Aplicada a la Medicina",
    description:
      "Curso intensivo sobre aplicaciones clínicas de terapias génicas y celulares",
    duration: "40 horas",
    modality: "Online",
    category: "Técnico",
  },
  {
    imageUrl:
      "https://cdn.pixabay.com/photo/2017/10/04/09/56/chemist-2815640_1280.jpg",
    title: "Gestión de Proyectos de Investigación",
    description:
      "Metodologías ágiles para la gestión eficiente de proyectos científicos",
    duration: "30 horas",
    modality: "Presencial",
    category: "Gestión",
  },
  {
    imageUrl:
      "https://cdn.pixabay.com/photo/2017/10/04/09/56/chemist-2815640_1280.jpg",
    title: "Ética en Investigación Clínica",
    description: "Normativas internacionales y buenas prácticas clínicas",
    duration: "20 horas",
    modality: "Híbrido",
    category: "Clínico",
  },
];