import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Obtener configuración del sitio
export async function GET() {
  try {
    // Buscar la configuración activa
    let siteConfig = await prisma.siteConfig.findFirst({
      where: { isActive: true },
      orderBy: { updatedAt: 'desc' }
    });

    // Si no existe configuración, crear una por defecto
    if (!siteConfig) {
      siteConfig = await prisma.siteConfig.create({
        data: {
          isActive: true,
          // Los valores por defecto ya están en el schema
        }
      });
    }

    return NextResponse.json({
      success: true,
      siteConfig
    });

  } catch (error) {
    console.error('Error fetching site config:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener configuración del sitio' },
      { status: 500 }
    );
  }
}

// POST/PUT - Crear o actualizar configuración del sitio
export async function POST(req: NextRequest) {
  try {
    const {
      // Metadatos básicos
      siteName,
      siteDescription,
      siteKeywords,
      siteUrl,
      
      // SEO y metadatos
      metaTitle,
      metaDescription,
      ogImage,
      ogDescription,
      
      // Contacto global
      globalEmail,
      globalPhone,
      globalAddress,
      emergencyContact,
      
      // Branding
      primaryLogo,
      secondaryLogo,
      favicon,
      
      // Colores
      primaryColor,
      secondaryColor,
      accentColor,
      lightColor,
      
      // Redes sociales
      facebookUrl,
      twitterUrl,
      linkedinUrl,
      instagramUrl,
      youtubeUrl,
      
      // Navegación
      mainNavLinks,
      
      // Mensajes del sistema
      notFoundTitle,
      notFoundMessage,
      notFoundButton,
      
      // Configuración técnica
      version
    } = await req.json();

    // Buscar configuración existente
    const existingConfig = await prisma.siteConfig.findFirst({
      where: { isActive: true }
    });

    let siteConfig;

    if (existingConfig) {
      // Actualizar configuración existente
      siteConfig = await prisma.siteConfig.update({
        where: { id: existingConfig.id },
        data: {
          // Metadatos básicos
          siteName: siteName || undefined,
          siteDescription: siteDescription || undefined,
          siteKeywords: siteKeywords || undefined,
          siteUrl: siteUrl || undefined,
          
          // SEO y metadatos
          metaTitle: metaTitle || undefined,
          metaDescription: metaDescription || undefined,
          ogImage: ogImage || undefined,
          ogDescription: ogDescription || undefined,
          
          // Contacto global
          globalEmail: globalEmail || undefined,
          globalPhone: globalPhone || undefined,
          globalAddress: globalAddress || undefined,
          emergencyContact: emergencyContact || undefined,
          
          // Branding
          primaryLogo: primaryLogo || undefined,
          secondaryLogo: secondaryLogo || undefined,
          favicon: favicon || undefined,
          
          // Colores
          primaryColor: primaryColor || undefined,
          secondaryColor: secondaryColor || undefined,
          accentColor: accentColor || undefined,
          lightColor: lightColor || undefined,
          
          // Redes sociales
          facebookUrl: facebookUrl || undefined,
          twitterUrl: twitterUrl || undefined,
          linkedinUrl: linkedinUrl || undefined,
          instagramUrl: instagramUrl || undefined,
          youtubeUrl: youtubeUrl || undefined,
          
          // Navegación
          mainNavLinks: mainNavLinks || undefined,
          
          // Mensajes del sistema
          notFoundTitle: notFoundTitle || undefined,
          notFoundMessage: notFoundMessage || undefined,
          notFoundButton: notFoundButton || undefined,
          
          // Configuración técnica
          version: version || undefined,
          
          updatedAt: new Date()
        }
      });
    } else {
      // Crear nueva configuración
      siteConfig = await prisma.siteConfig.create({
        data: {
          // Metadatos básicos
          siteName: siteName || "CIIMED",
          siteDescription: siteDescription || "Centro de Investigación e Innovación en Medicina",
          siteKeywords: siteKeywords || ["medicina", "investigación", "salud", "ciencia"],
          siteUrl: siteUrl || "https://ciimed.pa",
          
          // SEO y metadatos
          metaTitle: metaTitle || "CIIMED - Centro de Investigación e Innovación en Medicina",
          metaDescription: metaDescription || "Ubicado en la Ciudad de la Salud, este centro es un referente en investigación y desarrollo en el ámbito de la salud en Panamá.",
          ogImage: ogImage || undefined,
          ogDescription: ogDescription || undefined,
          
          // Contacto global
          globalEmail: globalEmail || "info@ciimed.pa",
          globalPhone: globalPhone || "+507 123-4567",
          globalAddress: globalAddress || "Ciudad de la Salud, Panamá",
          emergencyContact: emergencyContact || undefined,
          
          // Branding
          primaryLogo: primaryLogo || "/logo.png",
          secondaryLogo: secondaryLogo || "/logo_blanco.png",
          favicon: favicon || "/favicon.ico",
          
          // Colores
          primaryColor: primaryColor || "#285C4D",
          secondaryColor: secondaryColor || "#F4633A",
          accentColor: accentColor || "#212322",
          lightColor: lightColor || "#f2f2f2",
          
          // Redes sociales
          facebookUrl: facebookUrl || undefined,
          twitterUrl: twitterUrl || undefined,
          linkedinUrl: linkedinUrl || undefined,
          instagramUrl: instagramUrl || undefined,
          youtubeUrl: youtubeUrl || undefined,
          
          // Navegación
          mainNavLinks: mainNavLinks || [
            {"label":"Inicio","href":"/"},
            {"label":"Sobre Nosotros","href":"/about"},
            {"label":"Áreas de Investigación","href":"/research-areas"},
            {"label":"Formación y Capacitación","href":"/training"},
            {"label":"Alianzas Estratégicas","href":"/partnerships"},
            {"label":"Participa con Nosotros","href":"/get-involved"},
            {"label":"Divulgación Científica","href":"/scientificDissemination"},
            {"label":"Contacto","href":"/contact"}
          ],
          
          // Mensajes del sistema
          notFoundTitle: notFoundTitle || "Página no encontrada",
          notFoundMessage: notFoundMessage || "No se pudo encontrar el recurso solicitado.",
          notFoundButton: notFoundButton || "Volver a la página principal",
          
          // Configuración técnica
          isActive: true,
          version: version || "1.0.0"
        }
      });
    }

    return NextResponse.json({
      success: true,
      message: existingConfig ? 'Configuración actualizada exitosamente' : 'Configuración creada exitosamente',
      siteConfig
    });

  } catch (error) {
    console.error('Error saving site config:', error);
    return NextResponse.json(
      { success: false, error: 'Error al guardar configuración del sitio' },
      { status: 500 }
    );
  }
}

// PUT - Alias para POST (actualizar)
export async function PUT(req: NextRequest) {
  return POST(req);
}