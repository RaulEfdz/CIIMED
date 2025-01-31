import { MiniHeader } from "@/components/customs/Headers/MiniHeader";

export const Header = () => {
    return (
      <MiniHeader
        logoUrl={"/logo.jpg"}
        logoHref="/"
        navLinks={[
          {
            label: "Inicio",
            href: "/",
          },
          {
            label: "Sobre Nosotros",
            href: "/about",
          },
          {
            label: "Áreas de Investigación",
            href: "/research-areas",
          },
          {
            label: "Formación y Capacitación",
            href: "/training",
          },
          {
            label: "Alianzas Estratégicas",
            href: "/partnerships",
          },
          {
            label: "Participa con Nosotros",
            href: "/get-involved",
          },
          {
            label: "Contacto",
            href: "/contact",
          },
        ]}
        
      />
    );
  };