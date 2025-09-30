'use client'

import { FooterContact } from "@/components/customs/Footer/FooterContact";
import { ResponsiveHeader } from "@/components/customs/Headers/ResponsiveHeader";
import { useInstitutionalInfo } from "@/hooks/useInstitutionalInfo";

export const Header = () => {
    return (
      <ResponsiveHeader
        logoUrl={"/logo.png"}
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
            label:"Divulgación Cientifica",
            href:"/scientificDissemination"
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
    const { institutionalInfo, isLoading } = useInstitutionalInfo();
    
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
    
    // Generar datos del footer dinámicamente desde la DB
    const footerContactInfo = {
      email: institutionalInfo?.footerEmail || institutionalInfo?.email || "info@ciimed.pa",
      phone: institutionalInfo?.footerPhone || institutionalInfo?.phone || "+507 123-4567",
      address: institutionalInfo?.footerAddress || institutionalInfo?.address || "Ciudad de la Salud, Panamá",
      brand: institutionalInfo?.footerBrand || institutionalInfo?.name || "CIIMED"
    };

    // Configuración de estilos dinámicos
    const footerStyles = {
      backgroundColor: institutionalInfo?.footerBackgroundColor || '#285C4D',
      textColor: institutionalInfo?.footerTextColor || '#ffffff',
      accentColor: institutionalInfo?.footerAccentColor || '#F4633A'
    };

    if (isLoading) {
      return (
        <div className="w-full py-10 px-4 bg-[#285C4D] text-white flex justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
        </div>
      );
    }

    return (
      <FooterContact 
        navLinks={footerNavLinks} 
        contact={footerContactInfo}
        styles={footerStyles}
        copyright={institutionalInfo?.footerCopyright}
      />
    )
    
  }