import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign } from 'lucide-react';

const teamColors = {
  primary: "#285C4D",
  secondary: "#F4633A",
  dark: "#212322",
  light: "#f2f2f2"
};

export interface ServiceCardProps {
  nombre: string;
  descripcion: string | null;
  precio: number | null;
  activo: boolean;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  nombre,
  descripcion,
  precio,
  activo,
}) => {
  return (
    <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-200 dark:border-neutral-700 rounded-sm h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between bg-gray-100 dark:bg-neutral-800 p-4">
        <CardTitle className="text-xl font-bold line-clamp-2" style={{ color: teamColors.primary }}>{nombre}</CardTitle>
        <div className={`text-xs font-bold py-1 px-2 rounded-full ${activo ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
          {activo ? 'Activo' : 'Inactivo'}
        </div>
      </CardHeader>

      <CardContent className="p-6 flex-grow bg-[#F2F2F2] dark:bg-neutral-900">
        <p className="text-gray-700 dark:text-neutral-300 line-clamp-4 mb-4">{descripcion || 'Sin descripción.'}</p>
        
        <div className="flex items-center space-x-2 text-lg font-semibold" style={{ color: teamColors.secondary }}>
          <DollarSign className="h-5 w-5" />
          <span>{precio ? `$${precio.toFixed(2)}` : 'Precio no disponible'}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceCard;
