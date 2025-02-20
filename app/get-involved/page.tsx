import HireUs, { HireUsContent } from "@/components/customs/feedBack/HireUs";
import Hero from "./Hero";

const FormContact = () => {
  const participationContent: HireUsContent = {
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

  return <HireUs content={participationContent} />;
};

const Page = () => {
  return (
    <>
      <Hero />
      <FormContact />
    </>
  );
};

export default Page;
