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
    <footer className="w-full py-10 px-4 sm:px-6 lg:px-8 mx-auto bg-gray-900 text-white flex justify-center">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 my-10 max-w-[85rem] ">
        <div className="col-span-full hidden lg:col-span-1 lg:block">
          <a className="flex-none font-semibold text-xl text-white" href="#" aria-label="Brand">{contact.brand}</a>
          <p className="mt-3 text-xs sm:text-sm text-gray-400">© {new Date().getFullYear()} {contact.brand}.</p>
        </div>
        {navLinks.map((link, index) => (
          <div key={index}>
            <h4 className="text-xs font-semibold text-white uppercase">{link.label}</h4>
            <div className="mt-3 grid space-y-3 text-sm">
              <p>
                <a className="inline-flex gap-x-2 text-gray-400 hover:text-white" href={link.href}>{link.label}</a>
              </p>
            </div>
          </div>
        ))}
        <div>
          <h4 className="text-xs font-semibold text-white uppercase">Contacto</h4>
          <div className="mt-3 grid space-y-3 text-sm">
            <p className="flex items-center gap-2">
              <Mail className="w-4 h-4" /> {contact.email}
            </p>
            <p className="flex items-center gap-2">
              <Phone className="w-4 h-4" /> {contact.phone}
            </p>
            <p className="flex items-center gap-2">
              <MapPin className="w-4 h-4" /> {contact.address}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
