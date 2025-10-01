import type { Metadata } from "next";
import "./globals.css";
import { Footer, Header } from "./config/inital";
import ChatWidget from "@/components/ChatWidget";
import ConditionalLayout from "./components/ConditionalLayout";
import { getPrismaClient } from '@/lib/prisma';

// Función para generar metadatos dinámicos
export async function generateMetadata(): Promise<Metadata> {
  try {
    // Obtener configuración del sitio desde la BD
    const prisma = await getPrismaClient();
    const siteConfig = await prisma.siteConfig.findFirst({
      where: { isActive: true },
      select: {
        siteName: true,
        metaTitle: true,
        metaDescription: true,
        siteKeywords: true,
        ogImage: true,
        ogDescription: true,
        siteUrl: true,
        favicon: true
      }
    });

    // Fallbacks si no hay configuración
    const title = siteConfig?.metaTitle || siteConfig?.siteName || "CIIMED";
    const description = siteConfig?.metaDescription || "Ubicado en la Ciudad de la Salud, este centro es un referente en investigación y desarrollo en el ámbito de la salud en Panamá.";
    const keywords = siteConfig?.siteKeywords || ["medicina", "investigación", "salud", "ciencia"];
    const ogImage = siteConfig?.ogImage;
    const ogDescription = siteConfig?.ogDescription || description;
    const siteUrl = siteConfig?.siteUrl || "https://ciimed.pa";

    return {
      title,
      description,
      keywords: keywords.join(", "),
      authors: [{ name: "CIIMED" }],
      creator: "CIIMED",
      publisher: "CIIMED",
      openGraph: {
        title,
        description: ogDescription,
        url: siteUrl,
        siteName: title,
        images: ogImage ? [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: title,
          }
        ] : [],
        locale: 'es_ES',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description: ogDescription,
        images: ogImage ? [ogImage] : [],
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
        icon: siteConfig?.favicon || '/favicon.ico',
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    
    // Fallback metadata en caso de error
    return {
      title: "CIIMED",
      description: "Ubicado en la Ciudad de la Salud, este centro es un referente en investigación y desarrollo en el ámbito de la salud en Panamá.",
      keywords: "medicina, investigación, salud, ciencia",
    };
  }
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
