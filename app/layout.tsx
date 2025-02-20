import type { Metadata } from "next";
import "./globals.css";
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
      <body style={{ fontFamily: 'var(--font-harabara-mais)' }}
        
      >
        <Header />
        {children}
        <Footer/>
      </body>
    </html>
  );
}
