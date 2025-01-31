"use client";

import { Construction } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 text-center">
        <Construction className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold">{"Página 'Contact' en Construcción"}</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Estamos trabajando en esta sección. ¡Vuelve pronto para más
          información!
        </p>
      </div>
    </div>
  );
}
