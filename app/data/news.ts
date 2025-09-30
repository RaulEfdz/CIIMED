import { NewsCardProps } from "@/components/customs/Cards/NewsCard";
import { UPLOADTHING_IMAGES } from "@/lib/uploadthing-utils";

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
  // Agrega más noticias...
];
