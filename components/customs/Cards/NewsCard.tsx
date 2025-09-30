import React from 'react';
import { Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';

const teamColors = {
  primary: "#285C4D",
  secondary: "#F4633A",
  dark: "#212322",
  light: "#f2f2f2"
};

export interface NewsCardProps {
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  imgW?: number;
  imgH?: number;
  link: string;
  author: string;
  readTime: string;
}

const NewsCard: React.FC<NewsCardProps> = ({
  title,
  description,
  imageUrl,
  imageAlt,
  link,
  author,
  readTime
}) => {
  return (
    <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-200 dark:border-neutral-700 rounded-sm">
      {/* Imagen */}
      <div className="aspect-video relative overflow-hidden border-b">
        <Image
          className="w-full h-full absolute inset-0 object-cover transform hover:scale-105 transition-transform duration-300"
          alt={imageAlt}
          src={imageUrl}
          fill
        />
      </div>

      <CardContent className="p-6 bg-[#F2F2F2] dark:bg-neutral-900">
        {/* Información de Autor y Tiempo de Lectura */}
        <div className="flex items-center justify-between bg-gray-100 dark:bg-neutral-800 p-2 rounded-sm text-sm text-gray-600 dark:text-neutral-300 mb-4">
          <p className="font-medium" style={{ color: teamColors.dark }}>{author}</p>
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4 text-gray-500 dark:text-neutral-400" />
            <span>{readTime}</span>
          </div>
        </div>

        {/* Título y Descripción */}
        <h3 className="text-2xl font-bold mb-2 line-clamp-2" style={{ color: teamColors.primary }}>{title}</h3>
        <p className="text-gray-700 dark:text-neutral-300 line-clamp-3">{description}</p>

        {/* Botón de Leer Más */}
        <div className="mt-4">
          <a 
            href={link} 
            className="font-medium hover:underline"
            style={{ color: teamColors.secondary }}
          >
            Leer más →
          </a>
        </div>
      </CardContent>
    </Card>
  );
};

export default NewsCard;
