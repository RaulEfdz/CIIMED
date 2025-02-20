
// components/FormContact.tsx
import HireUs, { HireUsContent } from "@/components/customs/feedBack/HireUs";

const FormContact = () => {
  const allianceContent: HireUsContent = {
    title: "Solicitud de Alianza | Centro de Alianzas Estratégicas",
    subtitle: "Impulsa la innovación a través de colaboraciones estratégicas",
    description:
      "En nuestro centro buscamos socios comprometidos para desarrollar proyectos innovadores que generen un impacto positivo en la industria. Si estás interesado en formar parte de nuestras alianzas, completa la siguiente solicitud.",
    expectations: [
      "Colaboración en proyectos conjuntos",
      "Acceso a recursos y experiencia especializada",
      "Oportunidades de networking y crecimiento mutuo"
    ],
    form: {
      title: "Solicita tu Alianza",
      namePlaceholder: "Nombre",
      lastNamePlaceholder: "Apellido",
      emailPlaceholder: "Correo Electrónico",
      messagePlaceholder: "Describe tu propuesta",
      submitButton: "Enviar Solicitud"
    }
  };

  return <HireUs content={allianceContent} />;
};

export default FormContact;
