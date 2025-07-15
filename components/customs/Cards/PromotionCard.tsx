import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CldImage } from 'next-cloudinary';
import { Tag, CalendarOff } from 'lucide-react';

const teamColors = {
  primary: "#285C4D",
  secondary: "#F4633A",
  dark: "#212322",
  light: "#f2f2f2"
};

export interface PromotionCardProps {
  titulo: string;
  descripcion: string | null;
  imagen: string | null;
  vigente: boolean;
}

const PromotionCard: React.FC<PromotionCardProps> = ({
  titulo,
  descripcion,
  imagen,
  vigente,
}) => {
  return (
    <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-200 dark:border-neutral-700 rounded-sm h-full flex flex-col">
      {imagen && (
        <div className="aspect-video relative overflow-hidden border-b">
          <CldImage
            className="w-full h-full absolute inset-0 object-cover"
            alt={`Imagen de ${titulo}`}
            src={imagen}
            width={600}
            height={340}
            crop={{ type: "auto", source: true }}
          />
        </div>
      )}
      <CardHeader className="p-4 bg-gray-50 dark:bg-neutral-800">
        <CardTitle className="text-xl font-bold line-clamp-2" style={{ color: teamColors.primary }}>{titulo}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 flex-grow bg-[#F2F2F2] dark:bg-neutral-900">
        <p className="text-gray-700 dark:text-neutral-300 line-clamp-3 mb-4">{descripcion || 'Sin descripción detallada.'}</p>
        <div className={`flex items-center text-sm font-semibold ${vigente ? 'text-green-600' : 'text-red-600'}`}>
          {vigente ? <Tag className="h-4 w-4 mr-2" /> : <CalendarOff className="h-4 w-4 mr-2" />}
          <span>{vigente ? 'Vigente' : 'Expirada'}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default PromotionCard;
