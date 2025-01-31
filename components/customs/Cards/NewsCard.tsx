import React from 'react';
import { Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { CldImage } from 'next-cloudinary';

export interface NewsCardProps {
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  imgW: number;
  imgH: number;
  link: string;
  author: string;
  readTime: string;
}

const NewsCard: React.FC<NewsCardProps> = ({
  title,
  description,
  imageUrl,
  imageAlt,
  imgW,
  imgH,
  link,
  author,
  readTime
}) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 border rounded-none">
      {/* Imagen */}
      <div className="aspect-video relative overflow-hidden border-b">
        <CldImage
          className="w-full h-full absolute inset-0 object-cover transform hover:scale-105 transition-transform duration-300"
          alt={imageAlt}
          src={imageUrl}
          width={imgW}
          height={imgH}
          crop={{ type: "auto", source: true }}
        />
      </div>

      <CardContent className="p-4">
        {/* Información de Autor y Tiempo de Lectura en vCard */}
        <div className="flex items-center justify-between bg-gray-100 p-2 rounded-md text-sm text-gray-600 mb-3">
          <p className="font-medium">{author}</p>
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span>{readTime}</span>
          </div>
        </div>

        {/* Título y Descripción */}
        <h3 className="text-xl font-semibold mb-2 line-clamp-2">{title}</h3>
        <p className="text-gray-600 line-clamp-3">{description}</p>

        {/* Botón de Leer Más */}
        <div className="mt-4">
          <a 
            href={link} 
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Leer más →
          </a>
        </div>
      </CardContent>
    </Card>
  );
};

export default NewsCard;
