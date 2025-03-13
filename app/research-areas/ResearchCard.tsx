"use client";

import Image from "next/image";
import Link from "next/link";
import { ResearchItem } from "./ProyectosSection";

interface ResearchCardProps {
  item: ResearchItem;
}

const ResearchCard = ({ item }: ResearchCardProps) => {
  return (
    <div className="bg-[#285C4D] p-0  rounded-sm shadow-2xl pt-2">
      <div className="max-w-5xl  rounded-sm">
        {/* Título */}
        <div className="max-w-3xl bg-[#f2f2f2]  rounded-none p-4 pl-5  rounded-r-sm">
          <h2 className="text-[#F4633A] font-semibold text-2xl md:text-4xl md:leading-tight">
            {item.title}
          </h2>
          <p className="text-gray-700 mt-4">{item.description}</p>
        </div>
        
        {/* Contenido */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 lg:items-center p-10">
          {/* Imagen */}
          {item.imageUrl && (
            <div className="relative w-full h-48 md:h-64 lg:h-80 rounded-sm overflow-hidden bg-[#F4633A] shadow-sm">
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                className="object-cover pl-2  rounded-sm shadow-sm"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority={item.id <= 3}
              />
            </div>
          )}
          
          {/* Detalles */}
          <div>
            {/* Categorías */}
            {item.categories && (
              <div className="flex gap-2 mb-4">
                {item.categories.map((category) => (
                  <span
                    key={category}
                    className="uppercase text-[#F2F2F2] text-sm font-medium bg-[#F4633A] px-2 py-1 rounded-sm"
                  >
                    {category}
                  </span>
                ))}
              </div>
            )}
            
            {/* Información */}
            <div className="space-y-6">
              <div className="flex gap-x-5">
                {/* Icono */}
                <div className="relative after:absolute after:top-8 after:bottom-0 after:start-4 after:w-px after:bg-[#F4633A]">
                  <div className="relative z-10 size-8 flex justify-center items-center">
                    <span className="flex shrink-0 justify-center items-center size-8 border border-[#F4633A] text-[#F2F2F2] font-semibold text-xs uppercase rounded-full">
                      1
                    </span>
                  </div>
                </div>
                {/* Contenido */}
                <div className="grow pt-0.5 pb-8 sm:pb-12">
                  <p className="text-sm lg:text-base text-[#F2F2F2]">
                    <span className="text-[#F4633A]">Detalle:</span> {item.description}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Botón de acción */}
            <Link
              href="#"
              className="inline-flex items-center gap-x-2 py-2 px-3 bg-[#F4633A] font-medium text-sm text-[#212322] rounded-full shadow-lg"
            >
              Read more →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResearchCard;