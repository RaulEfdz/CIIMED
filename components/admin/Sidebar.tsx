"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Newspaper,
  Image,
  FileText,
  Users,
  Briefcase,
  Tags,
  MapPin,
  LogOut,
  Home,
  BookUser,
  FileQuestion,
} from "lucide-react";

const sidebarNavLinks = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Equipo de trabajo", href: "/admin/staff", icon: Users },
    { name: "Banners", href: "/admin/banners", icon: Image },
    { name: "Documentos", href: "/admin/documentos", icon: FileText },
    { name: "Noticias", href: "/admin/noticias", icon: Newspaper },
    { name: "Servicios", href: "/admin/servicios", icon: Briefcase },
    { name: "Promociones", href: "/admin/promociones", icon: Tags },
    { name: "Sucursales", href: "/admin/sucursales", icon: MapPin },
    { name: "Testimonios", href: "/admin/testimonios", icon: BookUser },
    { name: "FAQ", href: "/admin/faq", icon: FileQuestion },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 flex-shrink-0 bg-gray-800 text-white flex flex-col">
      <div className="h-16 flex items-center justify-center text-2xl font-bold">
        CIIMED Admin
      </div>
      <nav className="flex-1 px-2 py-4 space-y-1">
        {sidebarNavLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                isActive
                  ? "bg-gray-900 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
            >
              <link.icon className="mr-3 h-6 w-6" />
              {link.name}
            </Link>
          );
        })}
      </nav>
      <div className="px-2 py-4 space-y-1 border-t border-gray-700">
        <Link
          href="/"
          className="flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white"
        >
          <Home className="mr-3 h-6 w-6" />
          Volver al Sitio Público
        </Link>
        <button
          className="w-full flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white"
        >
          <LogOut className="mr-3 h-6 w-6" />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}
