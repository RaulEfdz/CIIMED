import { NewsCardProps } from "@/components/customs/Cards/NewsCard";
import { UPLOADTHING_IMAGES } from "@/lib/uploadthing-utils";
import { News as NewsType } from "@/hooks/useNews";

// Función para convertir datos de la DB al formato del componente NewsCard
export const generateNewsCardData = (newsArray: NewsType[]): NewsCardProps[] => {
  // Solo retornar datos de la base de datos - NO HAY FALLBACKS
  if (!newsArray || newsArray.length === 0) {
    return [];
  }

  return newsArray.map((news) => ({
    title: news.title,
    description: news.description,
    imageUrl: news.imageUrl || '', // Solo imagen de Supabase, sin placeholder
    imageAlt: news.imageAlt || news.title,
    imgW: news.imgW || 800,
    imgH: news.imgH || 800,
    link: news.link || `/noticias/${news.slug}`,
    author: news.author,
    readTime: news.readTime
  }));
};

// Ya no hay datos estáticos - todo viene de la base de datos
