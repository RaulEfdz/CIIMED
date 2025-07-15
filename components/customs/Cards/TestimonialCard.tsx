import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CldImage } from 'next-cloudinary';
import { User, MessageSquare } from 'lucide-react';

const teamColors = {
  primary: "#285C4D",
  secondary: "#F4633A",
  dark: "#212322",
  light: "#f2f2f2"
};

export interface TestimonialCardProps {
  nombre: string;
  mensaje: string;
  foto: string | null;
  activo: boolean;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  nombre,
  mensaje,
  foto,
  activo,
}) => {
  return (
    <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-200 dark:border-neutral-700 rounded-sm h-full flex flex-col">
      <CardContent className="p-6 flex-grow bg-[#F2F2F2] dark:bg-neutral-900 flex flex-col items-center text-center">
        <div className="relative w-24 h-24 mb-4">
          {foto ? (
            <CldImage
              className="rounded-full object-cover"
              src={foto}
              alt={`Foto de ${nombre}`}
              fill
              crop={{ type: "auto", source: true }}
            />
          ) : (
            <div className="w-full h-full rounded-full bg-gray-300 dark:bg-neutral-700 flex items-center justify-center">
              <User className="w-12 h-12 text-gray-500" />
            </div>
          )}
        </div>
        <h3 className="text-xl font-bold mb-2" style={{ color: teamColors.primary }}>{nombre}</h3>
        <p className="text-gray-600 dark:text-neutral-400 text-sm mb-4 line-clamp-1">
          <MessageSquare className="inline-block h-4 w-4 mr-1" />
          {`"${mensaje}"`}
        </p>
        <div className={`text-xs font-bold py-1 px-2 rounded-full ${activo ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
          {activo ? 'Activo' : 'Inactivo'}
        </div>
      </CardContent>
    </Card>
  );
};

export default TestimonialCard;
