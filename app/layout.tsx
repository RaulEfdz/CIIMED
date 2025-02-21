// app/layout.js
import type { Metadata } from "next";
import "./globals.css";
import Opening from "./opening/Opening";
import { Footer, Header } from "./config/inital";

export const metadata: Metadata = {
  title: "CIIMED",
  description:
    "Ubicado en la Ciudad de la Salud, este centro es un referente en investigación y desarrollo en el ámbito de la salud en Panamá.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Opening /> {/* Añade el componente Opening aquí */}
        <Header/>
        {children}
        <Footer/>
      </body>
    </html>
  );
}