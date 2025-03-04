import type { Metadata } from "next";
import "./globals.css";
import { Footer, Header } from "./config/inital";
import RobotipaAW from "@/tools/robotipa-agente-web/RobotipaAW";

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
        <Header />
        {children}
        <RobotipaAW
          initialChatOpen={false}
          sharedPositions={false}
          alignment="BR" 
        />
        <Footer />
      </body>
    </html>
  );
}
