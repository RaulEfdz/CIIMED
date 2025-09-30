import type { Metadata } from "next";
import "./globals.css";
import { Footer, Header } from "./config/inital";
import ChatWidget from "@/components/ChatWidget";
import ConditionalLayout from "./components/ConditionalLayout";

export const metadata: Metadata = {
  title: "CIIMED",
  description:
    "Ubicado en la Ciudad de la Salud, este centro es un referente en investigación y desarrollo en el ámbito de la salud en Panamá.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <ConditionalLayout>
          {children}
        </ConditionalLayout>
      </body>
    </html>
  );
}
