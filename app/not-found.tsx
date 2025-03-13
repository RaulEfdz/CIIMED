import Link from 'next/link';
import { HiExclamation } from 'react-icons/hi';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <HiExclamation className="w-16 h-16 text-red-500 mb-4 mx-auto" />
        <h2 className="text-4xl font-bold text-gray-800 mb-2">Página no encontrada</h2>
        <p className="text-gray-600 mb-6">No se pudo encontrar el recurso solicitado.</p>
        <Link href="/" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-md transition duration-300">
          Volver a la página principal
        </Link>
      </div>
    </div>
  );
}

// data.ts
export const notFoundData = {
  title: "Página no encontrada",
  message: "No se pudo encontrar el recurso solicitado.",
  returnHome: "Volver a la página principal",
};