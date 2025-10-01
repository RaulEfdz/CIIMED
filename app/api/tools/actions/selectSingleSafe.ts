'use client';

import { createClient } from '@/utils/supabase/client';

// Datos de fallback para CMS
const fallbackCMSData: Record<string, any> = {
  'Estudios': {
    id: 'fallback-estudios',
    page: 'Estudios',
    section: 'research',
    data: {
      title: 'Estudios de Investigación',
      items: [
        {
          title: 'Estudio de Medicina Preventiva',
          category: 'Medicina Preventiva',
          description: 'Investigación sobre estrategias de prevención de enfermedades cardiovasculares en la población panameña.',
          mainImage: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80'
        },
        {
          title: 'Análisis de Salud Pública',
          category: 'Salud Pública',
          description: 'Estudio epidemiológico sobre el impacto de factores ambientales en la salud comunitaria.',
          mainImage: 'https://images.unsplash.com/photo-1576669801820-4cc8b8b7c11a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80'
        },
        {
          title: 'Investigación en Biotecnología',
          category: 'Biotecnología',
          description: 'Desarrollo de nuevas técnicas biotecnológicas para el diagnóstico temprano de enfermedades.',
          mainImage: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80'
        }
      ]
    }
  },
  'Proyectos': {
    id: 'fallback-proyectos',
    page: 'Proyectos',
    section: 'research',
    data: {
      title: 'Proyectos de Investigación',
      items: [
        {
          title: 'Proyecto de Innovación Médica',
          category: 'Innovación',
          description: 'Desarrollo de dispositivos médicos innovadores para mejorar la atención sanitaria.',
          mainImage: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80'
        },
        {
          title: 'Investigación Clínica',
          category: 'Clínica',
          description: 'Ensayos clínicos para el desarrollo de nuevos tratamientos médicos.',
          mainImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80'
        }
      ]
    }
  },
  'Reconocimientos': {
    id: 'fallback-reconocimientos',
    page: 'Reconocimientos',
    section: 'research',
    data: {
      title: 'Reconocimientos y Logros',
      items: [
        {
          title: 'Premio a la Excelencia en Investigación',
          category: 'Premio',
          description: 'Reconocimiento por contribuciones destacadas en investigación médica.',
          mainImage: 'https://images.unsplash.com/photo-1567427018141-0584cfcbf1b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80'
        }
      ]
    }
  },
  'Highlight': {
    id: 'fallback-highlight',
    page: 'Highlight',
    section: 'hero',
    data: {
      title: 'Áreas de Investigación',
      subtitle: 'Explorando nuevas fronteras en medicina e investigación científica',
      description: 'En CIIMED nos dedicamos a desarrollar investigación de vanguardia en diversas áreas de la medicina para mejorar la salud de nuestra comunidad.',
      imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080&q=80',
      logoUrl: '/logo.png'
    }
  },
  'ResearchLine': {
    id: 'fallback-research-line',
    page: 'ResearchLine',
    section: 'research',
    data: {
      title: 'Líneas de Investigación',
      lines: [
        {
          icon: '🔬',
          title: 'Medicina Personalizada',
          description: 'Desarrollo de tratamientos personalizados basados en el perfil genético de los pacientes.'
        },
        {
          icon: '💊',
          title: 'Farmacología Clínica',
          description: 'Investigación sobre la eficacia y seguridad de nuevos medicamentos.'
        },
        {
          icon: '🧬',
          title: 'Biotecnología Médica',
          description: 'Aplicación de tecnología biotecnológica para el desarrollo de soluciones médicas innovadoras.'
        }
      ]
    }
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const selectSingleSafe = async <T = any>(
  tableName: string,
  propertyName: string,
  propertyValue: string | number | boolean | null | undefined
): Promise<T | null> => {
  console.log(`🔍 selectSingleSafe called with ${tableName}, ${propertyName}, ${propertyValue}`);
  try {
    const supabase = createClient();

    // Add timeout to prevent hanging connections
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Database query timeout')), 3000);
    });

    const queryPromise = supabase
      .from(tableName)
      .select('*')
      .eq(propertyName, propertyValue)
      .single();

    const { data, error } = await Promise.race([queryPromise, timeoutPromise]) as any;

    if (error) {
      throw error;
    }

    if (!data) {
      console.log(`📝 No data found in database for ${tableName} with ${propertyName} = ${propertyValue}, using fallback`);
      throw new Error('No data found in database');
    }

    return data as T || null;
  } catch (error) {
    console.warn(`Database connection failed for ${tableName}, using fallback data:`, error);
    
    // Usar datos de fallback si la base de datos no está disponible
    if (tableName === 'cms' && propertyName === 'page') {
      const fallbackData = fallbackCMSData[propertyValue as string];
      if (fallbackData) {
        console.log(`✅ Using fallback data for CMS page: ${propertyValue}`);
        return fallbackData as T;
      }
    }
    
    console.error(`❌ No fallback data available for ${tableName} with ${propertyName} = ${propertyValue}`);
    return null;
  }
};