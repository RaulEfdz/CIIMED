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
  
  export interface ParticipationContent {
    title: string;
    subtitle: string;
    description: string;
    expectations: string[];
    form: FormData;
  }
  
  export const heroData: HeroData = {
    title: "Participa con Nosotros",
    subtitle: "Descubre cómo formar parte de nuestra comunidad y aprovecha nuevas oportunidades para tu crecimiento.",
    imageUrl: "https://cdn.pixabay.com/photo/2019/04/03/03/05/medical-equipment-4099428_1280.jpg",
    primaryButton: { text: "Comenzar ahora", link: "#", disabled: true },
    secondaryButton: { text: "Ver tour", link: "#", disabled: true },
    overlayColor: "#285C4D",
    highlight: "/highlights/Nosotros.png",
  };
  
  export const participationContent: ParticipationContent = {
    title: "Participa con Nosotros",
    subtitle: "Únete a nuestra comunidad y haz crecer tu futuro",
    description:
      "Explora nuestras oportunidades laborales, convocatorias de investigación y pasantías para impulsar tu desarrollo profesional y académico.",
    expectations: [
      "Oportunidades laborales",
      "Convocatorias de investigación",
      "Pasantías: Adquiere experiencia colaborando con nosotros.",
    ],
    form: {
      title: "Formulario de Participación",
      namePlaceholder: "Tu Nombre",
      lastNamePlaceholder: "Tu Apellido",
      emailPlaceholder: "Tu Correo Electrónico",
      messagePlaceholder: "Cuéntanos en qué área te gustaría participar",
      submitButton: "Enviar Solicitud",
    },
  };