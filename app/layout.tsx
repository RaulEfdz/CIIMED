"use client";

import "./globals.css";
import { Footer, Header } from "./config/inital";
import RobotipaAW from "@/app/tools/robotipa-agente-web/RobotipaAW";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminPage = pathname ? pathname.startsWith("/admin") : false;

  return (
    <html lang="es">
      <body>
        {!isAdminPage && <Header />}
        {children}
        {!isAdminPage && <RobotipaAW />}
        {!isAdminPage && <Footer />}
      </body>
    </html>
  );
}
