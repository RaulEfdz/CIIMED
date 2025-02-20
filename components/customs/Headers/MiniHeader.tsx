"use client";

import React from "react";
import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Definición de los tipos para las props
interface NavLink {
  label: string;
  href: string;
}

interface MiniHeaderProps {
  logoUrl: string;
  logoHref: string;
  navLinks: NavLink[];
}

export const MiniHeader: React.FC<MiniHeaderProps> = ({ logoUrl, logoHref, navLinks }) => {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 inset-x-0 flex flex-wrap md:justify-start md:flex-nowrap z-50 w-full text-sm">
      <nav className="shadow mb-3 mt-4 relative w-auto bg-[#F2F2F2] border border-none rounded-[1.5rem] mx-2 py-2 md:flex md:items-center md:justify-between md:py-0 md:px-6 md:mx-auto dark:bg-neutral-900 dark:border-neutral-700">
        <div className="px-4 md:px-0 flex justify-between items-center w-full">
          <div className="flex items-center">
            {/* Logo */}
            <Link href={logoHref} className="flex-none rounded-sm text-xl inline-block font-semibold focus:outline-none focus:opacity-80" aria-label="Logo">
              <Image src={logoUrl} alt="Logo" className="w-10 h-auto p-1" height={100} width={100} />
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex md:items-center md:justify-end gap-3 md:gap-4 py-2 md:py-0 md:ps-7">
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
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button type="button" className="flex justify-center items-center size-6 border border-gray-200 text-[#F4633A] rounded-full hover:bg-[#F4633A] hover:text-white focus:outline-none transition-colors duration-300 dark:border-neutral-700 dark:hover:bg-[#F4633A] dark:hover:text-white">
            <Menu className="size-4" />
          </button>
        </div>
      </nav>
    </header>
  );
};

MiniHeader.displayName = "MiniHeader";
