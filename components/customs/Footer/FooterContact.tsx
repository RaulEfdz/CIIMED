import React from "react";
import { Mail, Phone, MapPin } from "lucide-react";

interface NavLinkProps {
  label: string;
  href: string;
}

interface ContactInfo {
  email: string;
  phone: string;
  address: string;
  brand: string;
}

interface FooterStyles {
  backgroundColor: string;
  textColor: string;
  accentColor: string;
}

interface FooterProps {
  navLinks: NavLinkProps[];
  contact: ContactInfo;
  styles?: FooterStyles;
  copyright?: string;
}


export const FooterContact: React.FC<FooterProps> = ({ navLinks, contact, styles, copyright }) => {
  const footerStyles = styles || {
    backgroundColor: '#285C4D',
    textColor: '#ffffff',
    accentColor: '#F4633A'
  };

  return (
    <footer 
      className="w-full py-10 px-4 sm:px-6 lg:px-8 flex flex-col items-center"
      style={{ 
        backgroundColor: footerStyles.backgroundColor,
        color: footerStyles.textColor
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 max-w-[85rem] w-full">
        {/* Marca */}
        <div className="lg:col-span-1 flex flex-col">
          <a
            className="text-2xl font-bold"
            href="#"
            aria-label="Brand"
            style={{ color: footerStyles.textColor }}
          >
            {contact.brand}
          </a>
          <p className="mt-3 text-xs sm:text-sm opacity-70">
            {copyright || `© ${new Date().getFullYear()} ${contact.brand}. Todos los derechos reservados.`}
          </p>
        </div>

        {/* Links de Navegación */}
        <div className="col-span-2 grid grid-cols-2 md:grid-cols-3 gap-6">
          {navLinks.map((link, index) => (
            <div key={index}>
              <h4 
                className="text-xs font-semibold uppercase"
                style={{ color: footerStyles.textColor }}
              >
                {link.label}
              </h4>
              <div className="mt-3">
                <a
                  className="inline-flex gap-x-2 opacity-70 hover:opacity-100 transition-opacity"
                  href={link.href}
                  style={{ 
                    color: footerStyles.textColor,
                    '--hover-color': footerStyles.accentColor
                  } as React.CSSProperties}
                  onMouseEnter={(e) => e.currentTarget.style.color = footerStyles.accentColor}
                  onMouseLeave={(e) => e.currentTarget.style.color = footerStyles.textColor}
                >
                  {link.label}
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Contacto */}
        <div className="col-span-1">
          <h4 
            className="text-xs font-semibold uppercase"
            style={{ color: footerStyles.textColor }}
          >
            Contacto
          </h4>
          <div className="mt-3 space-y-3 text-sm">
            <p 
              className="flex items-center gap-2 opacity-70 hover:opacity-100 transition-opacity"
              style={{ color: footerStyles.textColor }}
            >
              <Mail className="w-4 h-4" style={{ color: footerStyles.accentColor }} /> 
              {contact.email}
            </p>
            <p 
              className="flex items-center gap-2 opacity-70 hover:opacity-100 transition-opacity"
              style={{ color: footerStyles.textColor }}
            >
              <Phone className="w-4 h-4" style={{ color: footerStyles.accentColor }} /> 
              {contact.phone}
            </p>
            <p 
              className="flex items-center gap-2 opacity-70 hover:opacity-100 transition-opacity"
              style={{ color: footerStyles.textColor }}
            >
              <MapPin className="w-4 h-4" style={{ color: footerStyles.accentColor }} /> 
              {contact.address}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
