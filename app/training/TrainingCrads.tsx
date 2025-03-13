"use client";

import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { ClockIcon } from "lucide-react";
import { coursesData, CourseCardData } from "./data";

const CourseCard = ({
  imageUrl,
  title,
  description,
  duration,
  modality,
  category,
}: CourseCardData) => (
  <div className="transform transition-all duration-300 hover:scale-105 hover:shadow-xl w-full">
    <Card className="rounded-sm overflow-hidden cursor-pointer bg-[#F2F2F2]">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="relative w-full md:w-1/3 h-48 md:h-52 shrink-0 bg-gray-200 rounded-sm overflow-hidden">
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <div className="flex flex-col justify-between flex-1 min-w-0">
            <div className="space-y-3">
              <span className="uppercase text-gray-700 text-sm font-medium bg-gray-200 px-2 py-1 rounded-sm">
                {category}
              </span>
              <h3 className="text-gray-900 text-2xl font-bold tracking-tight line-clamp-2">
                {title}
              </h3>
              <p className="text-gray-600 text-base line-clamp-3">
                {description}
              </p>
              <div className="flex gap-4 items-center text-gray-600 text-sm">
                <span>
                  <ClockIcon className="h-4 w-4 inline mr-1" />
                  {duration}
                </span>
                <span>{modality}</span>
              </div>
            </div>
            <div className="pt-4 mt-4 border-t border-gray-300 flex justify-between items-center">
              <Link
                href="#"
                className="text-[#285C4D] hover:text-[#285C4D] text-sm font-medium"
              >
                Más información →
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

const CourseSection = () => (
  <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <div className="mb-16 text-center">
      <span className="inline-block px-4 py-1 rounded-full text-sm font-medium bg-[#285C4D] text-white">
        Formación Profesional
      </span>
      <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl mb-4">
        Próximos Cursos
      </h1>
      <div className="w-24 h-1 bg-[#285C4D] mx-auto rounded-full"></div>
    </div>
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
      {coursesData.map((course, index) => (
        <CourseCard key={index} {...course} />
      ))}
    </div>
  </section>
);

export default CourseSection;