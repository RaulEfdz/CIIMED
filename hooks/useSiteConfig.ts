import { useState, useEffect, useCallback } from 'react';

export interface NavLink {
  label: string;
  href: string;
}

export interface SiteConfig {
  id: string;
  
  // Metadatos básicos del sitio
  siteName?: string;
  siteDescription?: string;
  siteKeywords?: string[];
  siteUrl?: string;
  
  // SEO y metadatos específicos
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
  ogDescription?: string;
  
  // Información de contacto global
  globalEmail?: string;
  globalPhone?: string;
  globalAddress?: string;
  emergencyContact?: string;
  
  // Branding y logos
  primaryLogo?: string;
  secondaryLogo?: string;
  favicon?: string;
  
  // Colores del tema
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  lightColor?: string;
  
  // Redes sociales
  facebookUrl?: string;
  twitterUrl?: string;
  linkedinUrl?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
  
  // Navegación principal
  mainNavLinks?: NavLink[];
  
  // Mensajes del sistema
  notFoundTitle?: string;
  notFoundMessage?: string;
  notFoundButton?: string;
  
  // Configuración técnica
  isActive: boolean;
  version?: string;
  
  // Fechas de control
  createdAt: string;
  updatedAt: string;
}

export const useSiteConfig = () => {
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSiteConfig = useCallback(async (retryCount = 0) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
      const response = await fetch(`${baseUrl}/api/site-config`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        // Si es un error 500 y es el primer intento, reintenta una vez más
        if (response.status === 500 && retryCount === 0) {
          console.warn('API returned 500, retrying once...');
          await new Promise(resolve => setTimeout(resolve, 1000)); // Esperar 1 segundo
          return fetchSiteConfig(1);
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.siteConfig) {
        // Parsear mainNavLinks si es string JSON
        if (typeof data.siteConfig.mainNavLinks === 'string') {
          try {
            data.siteConfig.mainNavLinks = JSON.parse(data.siteConfig.mainNavLinks);
          } catch (e) {
            console.warn('Error parsing mainNavLinks:', e);
            data.siteConfig.mainNavLinks = [];
          }
        }
        
        setSiteConfig(data.siteConfig);
      } else {
        throw new Error(data.error || 'Error al obtener configuración del sitio');
      }
    } catch (err) {
      console.error('Error fetching site config:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateSiteConfig = useCallback(async (updates: Partial<SiteConfig>) => {
    try {
      setError(null);
      
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
      const response = await fetch(`${baseUrl}/api/site-config`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.siteConfig) {
        // Parsear mainNavLinks si es string JSON
        if (typeof data.siteConfig.mainNavLinks === 'string') {
          try {
            data.siteConfig.mainNavLinks = JSON.parse(data.siteConfig.mainNavLinks);
          } catch (e) {
            console.warn('Error parsing mainNavLinks:', e);
            data.siteConfig.mainNavLinks = [];
          }
        }
        
        setSiteConfig(data.siteConfig);
        return { success: true, message: data.message };
      } else {
        throw new Error(data.error || 'Error al actualizar configuración del sitio');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  useEffect(() => {
    fetchSiteConfig();
  }, [fetchSiteConfig]);

  return {
    siteConfig,
    setSiteConfig,
    isLoading,
    error,
    fetchSiteConfig,
    updateSiteConfig,
    refetch: fetchSiteConfig
  };
};

// Funciones helper para obtener valores con fallbacks
export const getSiteConfigValue = (
  siteConfig: SiteConfig | null,
  key: keyof SiteConfig,
  fallback: any = ''
) => {
  return siteConfig?.[key] ?? fallback;
};

// Función para obtener colores del tema
export const getThemeColors = (siteConfig: SiteConfig | null) => ({
  primary: getSiteConfigValue(siteConfig, 'primaryColor', '#285C4D'),
  secondary: getSiteConfigValue(siteConfig, 'secondaryColor', '#F4633A'),
  accent: getSiteConfigValue(siteConfig, 'accentColor', '#212322'),
  light: getSiteConfigValue(siteConfig, 'lightColor', '#f2f2f2'),
});

// Función para obtener enlaces de navegación
export const getNavLinks = (siteConfig: SiteConfig | null): NavLink[] => {
  const defaultNavLinks: NavLink[] = [
    { label: "Inicio", href: "/" },
    { label: "Sobre Nosotros", href: "/about" },
    { label: "Áreas de Investigación", href: "/research-areas" },
    { label: "Formación y Capacitación", href: "/training" },
    { label: "Alianzas Estratégicas", href: "/partnerships" },
    { label: "Participa con Nosotros", href: "/get-involved" },
    { label: "Divulgación Científica", href: "/scientificDissemination" },
    { label: "Contacto", href: "/contact" }
  ];

  return siteConfig?.mainNavLinks || defaultNavLinks;
};

// Función para obtener información de contacto
export const getContactInfo = (siteConfig: SiteConfig | null) => ({
  email: getSiteConfigValue(siteConfig, 'globalEmail', 'info@ciimed.pa'),
  phone: getSiteConfigValue(siteConfig, 'globalPhone', '+507 123-4567'),
  address: getSiteConfigValue(siteConfig, 'globalAddress', 'Ciudad de la Salud, Panamá'),
  emergency: getSiteConfigValue(siteConfig, 'emergencyContact', ''),
});

// Función para obtener URLs de redes sociales
export const getSocialMedia = (siteConfig: SiteConfig | null) => ({
  facebook: getSiteConfigValue(siteConfig, 'facebookUrl', ''),
  twitter: getSiteConfigValue(siteConfig, 'twitterUrl', ''),
  linkedin: getSiteConfigValue(siteConfig, 'linkedinUrl', ''),
  instagram: getSiteConfigValue(siteConfig, 'instagramUrl', ''),
  youtube: getSiteConfigValue(siteConfig, 'youtubeUrl', ''),
});

// Función para obtener branding
export const getBranding = (siteConfig: SiteConfig | null) => ({
  primaryLogo: getSiteConfigValue(siteConfig, 'primaryLogo', '/logo.png'),
  secondaryLogo: getSiteConfigValue(siteConfig, 'secondaryLogo', '/logo_blanco.png'),
  favicon: getSiteConfigValue(siteConfig, 'favicon', '/favicon.ico'),
});

// Función para obtener metadatos SEO
export const getSEOMetadata = (siteConfig: SiteConfig | null) => ({
  title: getSiteConfigValue(siteConfig, 'metaTitle', 'CIIMED'),
  description: getSiteConfigValue(siteConfig, 'metaDescription', 'Centro de Investigación e Innovación en Medicina'),
  keywords: getSiteConfigValue(siteConfig, 'siteKeywords', ['medicina', 'investigación', 'salud']),
  ogImage: getSiteConfigValue(siteConfig, 'ogImage', ''),
  ogDescription: getSiteConfigValue(siteConfig, 'ogDescription', ''),
  url: getSiteConfigValue(siteConfig, 'siteUrl', 'https://ciimed.pa'),
});

// Función para obtener mensajes del sistema
export const getSystemMessages = (siteConfig: SiteConfig | null) => ({
  notFoundTitle: getSiteConfigValue(siteConfig, 'notFoundTitle', 'Página no encontrada'),
  notFoundMessage: getSiteConfigValue(siteConfig, 'notFoundMessage', 'No se pudo encontrar el recurso solicitado.'),
  notFoundButton: getSiteConfigValue(siteConfig, 'notFoundButton', 'Volver a la página principal'),
});