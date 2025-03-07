"use client";

import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavLink {
  label: string;
  href: string;
}

interface ResponsiveHeaderProps {
  logoUrl: string;
  logoHref: string;
  navLinks: NavLink[];
}

export const ResponsiveHeader: React.FC<ResponsiveHeaderProps> = ({ logoUrl, logoHref, navLinks }) => {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== 'undefined') {
        setIsMobile(window.innerWidth < 768);
      }
    };

    handleResize();
    if (typeof window !== 'undefined') {
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const activeLink = navLinks.find((link) => link.href === pathname);
  const activeLabel = activeLink ? activeLink.label : "";

  return (
    <header className="fixed top-0 inset-x-0 z-40 w-full text-sm justify-center align-middle items-center lg:flex">
      <nav className="shadow mt-4 mb-3 relative lg:w-[75vw] bg-[#F2F2F2] border border-none rounded-[1.5rem] mx-2 py-2 dark:bg-neutral-900 dark:border-neutral-700">
        <div className="px-4 flex justify-between items-center w-full">
          {/* Logo */}
          <Link href={logoHref} className="flex-none text-xl font-semibold focus:outline-none focus:opacity-80" aria-label="Logo">
            <Image src={logoUrl} alt="Logo" className="w-10 h-auto p-1" height={100} width={100} />
          </Link>

          {isMobile ? (
            <>
              {/* Label de la ruta activa en el centro */}
              <div className="flex-1 text-center">
                <span className="text-[#F4633A] font-bold">{activeLabel}</span>
              </div>
              {/* Botón para desplegar el menú */}
              <button
                type="button"
                onClick={toggleMenu}
                className="flex items-center justify-center p-2 border border-gray-200 text-[#F4633A] rounded-full hover:bg-[#F4633A] hover:text-white focus:outline-none transition-colors duration-300 dark:border-neutral-700 dark:hover:bg-[#F4633A] dark:hover:text-white"
              >
                {isMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </>
          ) : (
            // Versión escritorio: muestra todos los links de navegación
            <div className="flex items-center gap-3 md:gap-4 py-2 md:py-0">
              {navLinks.map((link, index) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={index}
                    href={link.href}
                    className={`py-0.5 md:py-2 px-3 md:px-2 transition-colors duration-300 ${
                      isActive
                        ? "font-bold text-[#F4633A] dark:text-[#F4633A]"
                        : "text-gray-700 hover:text-[#F4633A] dark:text-neutral-400 dark:hover:text-[#F4633A]"
                    } focus:outline-none`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Menú desplegable para mobile */}
        {isMobile && isMenuOpen && (
          <div className="mt-2 px-4">
            <ul className="flex flex-col gap-2">
              {navLinks.map((link, index) => {
                const isActive = pathname === link.href;
                return (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className={`block py-2 px-3 rounded transition-colors duration-300 ${
                        isActive
                          ? "font-bold text-[#F4633A] dark:text-[#F4633A]"
                          : "text-gray-700 hover:text-[#F4633A] dark:text-neutral-400 dark:hover:text-[#F4633A]"
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
};

ResponsiveHeader.displayName = "ResponsiveHeader";