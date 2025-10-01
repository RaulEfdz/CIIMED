import { NewsCardProps } from "@/components/customs/Cards/NewsCard";
import { UPLOADTHING_IMAGES } from "@/lib/uploadthing-utils";
import { News as NewsType } from "@/hooks/useNews";

// Función para convertir datos de la DB al formato del componente NewsCard
export const generateNewsCardData = (newsArray: NewsType[]): NewsCardProps[] => {
  if (!newsArray || newsArray.length === 0) {
    // Datos por defecto si no hay noticias en la DB
    return [
      {
        title: "Noticia 1",
        description: "Descripción breve de la noticia 1.",
        imageUrl: UPLOADTHING_IMAGES.NEWS_IMAGE,
        imageAlt: "Imagen de noticia 1",
        imgW: 800,
        imgH: 800,
        link: "#",
        author: "Autor",
        readTime: "5 min",
      },
      {
        title: "Noticia 2",
        description: "Descripción breve de la noticia 2.",
        imageUrl: UPLOADTHING_IMAGES.NEWS_IMAGE,
        imageAlt: "Imagen de noticia 2",
        imgW: 800,
        imgH: 800,
        link: "#",
        author: "Autor",
        readTime: "5 min",
      },
      {
        title: "Noticia 2",
        description: "Descripción breve de la noticia 2.",
        imageUrl: UPLOADTHING_IMAGES.NEWS_IMAGE,
        imageAlt: "Imagen de noticia 2",
        imgW: 800,
        imgH: 800,
        link: "#",
        author: "Autor",
        readTime: "5 min",
      },
    ];
  }

  return newsArray.map((news) => ({
    title: news.title,
    description: news.description,
    imageUrl: news.imageUrl || UPLOADTHING_IMAGES.NEWS_IMAGE,
    imageAlt: news.imageAlt || news.title,
    imgW: news.imgW || 800,
    imgH: news.imgH || 800,
    link: news.link || `/noticias/${news.slug}`,
    author: news.author,
    readTime: news.readTime
  }));
};

// Datos estáticos como fallback (mantener compatibilidad)
export const News: NewsCardProps[] = [
  {
    title: "Noticia 1",
    description: "Descripción breve de la noticia 1.",
    imageUrl: UPLOADTHING_IMAGES.NEWS_IMAGE,
    imageAlt: "Imagen de noticia 1",
    imgW: 800,
    imgH: 800,
    link: "#",
    author: "Autor",
    readTime: "5 min",
  },
  {
    title: "Noticia 2",
    description: "Descripción breve de la noticia 2.",
    imageUrl: UPLOADTHING_IMAGES.NEWS_IMAGE,
    imageAlt: "Imagen de noticia 2",
    imgW: 800,
    imgH: 800,
    link: "#",
    author: "Autor",
    readTime: "5 min",
  },
  {
    title: "Noticia 2",
    description: "Descripción breve de la noticia 2.",
    imageUrl: UPLOADTHING_IMAGES.NEWS_IMAGE,
    imageAlt: "Imagen de noticia 2",
    imgW: 800,
    imgH: 800,
    link: "#",
    author: "Autor",
    readTime: "5 min",
  },
];
