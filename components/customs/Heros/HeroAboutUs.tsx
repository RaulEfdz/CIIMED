"use client";

import React from "react";
import { Briefcase, Building2 } from "lucide-react";
import { CldImage } from "next-cloudinary";

interface AboutUsProps {
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  imgW: number;
  imgH: number;
  mission: string;
  vision: string;
}

const AboutUs: React.FC<AboutUsProps> = ({
  title,
  description,
  imageUrl,
  imageAlt,
  imgW,
  imgH,
  mission,
  vision,
}) => {
  return (
    <div className="h-auto bg-transparent p-6 pb-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2 space-y-6">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">{title}</h1>
            <p className="text-lg text-gray-600">{description}</p>
            <div className="pt-8 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-100 p-6 ">
                  <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-blue-600" />Visión
                  </h2>
                  <p className="text-gray-600 text-justify">{mission}</p>
                </div>
                <div className="bg-slate-100 p-6 ">
                  <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-blue-600" /> Visión
                  </h2>
                  <p className="text-gray-600">{vision}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:w-1/2">
            <CldImage
              className="w-full h-auto "
              src={imageUrl}
              alt={imageAlt}
              width={imgW}
              height={imgH}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
