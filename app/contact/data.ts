// data.ts
export interface HireUsContent {
    title: string;
    subtitle: string;
    description: string;
    expectations: string[];
    form: {
      title: string;
      namePlaceholder: string;
      lastNamePlaceholder: string;
      emailPlaceholder: string;
      messagePlaceholder: string;
      submitButton: string;
    };
  }
  
  export const allianceContent: HireUsContent = {
    title: "Contacto | Centro de Atención",
    subtitle: "Conéctate con nosotros para más información",
    description:
      "Estamos aquí para responder tus preguntas y brindarte la mejor atención. Completa el siguiente formulario y nos pondremos en contacto contigo lo antes posible.",
    expectations: [
      "Atención personalizada",
      "Respuestas rápidas y efectivas",
      "Soporte en todo momento",
    ],
    form: {
      title: "Formulario de Contacto",
      namePlaceholder: "Tu Nombre",
      lastNamePlaceholder: "Tu Apellido",
      emailPlaceholder: "Tu Correo Electrónico",
      messagePlaceholder: "Escribe tu mensaje",
      submitButton: "Enviar Mensaje",
    },
  };
  export const mapubic = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.9933733942776!2d-79.53632542397723!3d8.97275568986472!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8faca8c1954bfe75%3A0x2874244d550d2e58!2sHospital%20Nacional!5e0!3m2!1ses!2spa!4v1739394007363!5m2!1ses!2spa"
