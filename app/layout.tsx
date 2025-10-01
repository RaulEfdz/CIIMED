import type { Metadata } from "next";
import "./globals.css";
import { Footer, Header } from "./config/inital";
import ChatWidget from "@/components/ChatWidget";
import ConditionalLayout from "./components/ConditionalLayout";
import { getSiteConfigSafe } from '@/lib/prisma-wrapper';

// Función para generar metadatos dinámicos (simplificada para evitar problemas de DB)
export async function generateMetadata(): Promise<Metadata> {
  // Usar metadatos estáticos mientras se resuelve la conectividad de DB
  const title = "CIIMED";
  const description = "Ubicado en la Ciudad de la Salud, este centro es un referente en investigación y desarrollo en el ámbito de la salud en Panamá.";
  const siteUrl = "https://ciimed.pa";

  return {
    title,
    description,
    keywords: "medicina, investigación, salud, ciencia, CIIMED, Panamá",
    authors: [{ name: "CIIMED" }],
    creator: "CIIMED",
    publisher: "CIIMED",
    openGraph: {
      title,
      description,
      url: siteUrl,
      siteName: title,
      locale: 'es_ES',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    icons: {
      icon: '/favicon.ico',
    },
  };
}

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
