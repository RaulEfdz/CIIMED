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

interface FooterProps {
  navLinks: NavLinkProps[];
  contact: ContactInfo;
}

export const FooterContact: React.FC<FooterProps> = ({ navLinks, contact }) => {
  return (
    <footer className="w-full py-10 px-4 sm:px-6 lg:px-8 bg-[#285C4D] text-white flex justify-center">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 max-w-[85rem] w-full">
        {/* Marca */}
        <div className="lg:col-span-1 flex flex-col">
          <a
            className="text-2xl font-bold text-white"
            href="#"
            aria-label="Brand"
          >
            {contact.brand}
          </a>
          <p className="mt-3 text-xs sm:text-sm text-gray-400">
            © {new Date().getFullYear()} {contact.brand}. Todos los derechos reservados.
          </p>
        </div>

        {/* Links de Navegación */}
        <div className="col-span-2 grid grid-cols-2 md:grid-cols-3 gap-6">
          {navLinks.map((link, index) => (
            <div key={index}>
              <h4 className="text-xs font-semibold text-white uppercase">{link.label}</h4>
              <div className="mt-3">
                <a
                  className="inline-flex gap-x-2 text-gray-400 hover:text-[#F4633A] transition-colors"
                  href={link.href}
                >
                  {link.label}
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Contacto */}
        <div className="col-span-1">
          <h4 className="text-xs font-semibold text-white uppercase">Contacto</h4>
          <div className="mt-3 space-y-3 text-sm">
            <p className="flex items-center gap-2 text-gray-400 hover:text-[#F4633A] transition-colors">
              <Mail className="w-4 h-4 text-[#F4633A]" /> {contact.email}
            </p>
            <p className="flex items-center gap-2 text-gray-400 hover:text-[#F4633A] transition-colors">
              <Phone className="w-4 h-4 text-[#F4633A]" /> {contact.phone}
            </p>
            <p className="flex items-center gap-2 text-gray-400 hover:text-[#F4633A] transition-colors">
              <MapPin className="w-4 h-4 text-[#F4633A]" /> {contact.address}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
