import { FooterContact } from "@/components/customs/Footer/FooterContact";
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

  export const Footer =()=>{
    const footerNavLinks = [
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
    ];
    
    const footerContactInfo = {
      email: "contacto@ejemplo.com",
      phone: "+123 456 7890",
      address: "Calle Ejemplo, Ciudad, País",
      brand: "CIIMED"
    };

    return (
      <FooterContact navLinks={footerNavLinks} contact={footerContactInfo}/>
    )
    
  }