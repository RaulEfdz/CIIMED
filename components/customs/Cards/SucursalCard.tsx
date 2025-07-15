import Link from 'next/link';

// Type for a single branch
interface Sucursal {
  id: number;
  nombre: string;
  direccion: string;
  telefono?: string | null;
  horario?: string | null;
  mapaUrl?: string | null;
}

// Props for the SucursalCard component
interface SucursalCardProps {
  sucursal: Sucursal;
}

const SucursalCardComponent = ({ sucursal }: SucursalCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-2xl font-bold mb-3">{sucursal.nombre}</h3>
      <p className="text-gray-700 mb-2">{sucursal.direccion}</p>
      {sucursal.telefono && <p className="text-gray-700 mb-2"><strong>Teléfono:</strong> {sucursal.telefono}</p>}
      {sucursal.horario && <p className="text-gray-700 mb-4"><strong>Horario:</strong> {sucursal.horario}</p>}
      {sucursal.mapaUrl && (
        <Link href={sucursal.mapaUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
          Ver en mapa
        </Link>
      )}
    </div>
  );
};

export default SucursalCardComponent;