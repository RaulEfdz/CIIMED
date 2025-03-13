"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Feature } from "./data";

interface AboutUsMissionVisionProps {
  features: Feature[];
}

const AboutUsMissionVision: React.FC<AboutUsMissionVisionProps> = ({ features }) => {
  const [activeFeature, setActiveFeature] = useState(features[0]);

  return (
    <section className="mx-auto max-w-7xl w-7xl ">
      <Card className="rounded-sm bg-transparent shadow-none border-none">
        <CardContent className="">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Image Section - Made larger */}
            <div className="relative w-full h-[600px]  overflow-hidden rounded-sm">
              <Image
                src={activeFeature.imageUrl}
                alt={activeFeature.title}
                fill
                className="object-cover"
              />
            </div>

            {/* Features Section */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-8">
                Nuestra Información
              </h2>
              <nav className="grid gap-6" aria-label="Tabs">
                {features.map((feature) => (
                  <button
                    key={feature.id}
                    type="button"
                    className={cn(
                      "flex items-start gap-4 p-6 rounded-sm transition-all text-left",
                      "hover:bg-gray-100/50 focus:outline-none focus:ring-2 focus:ring-[#285C4D]",
                      activeFeature.id === feature.id
                        ? "bg-[#285C4D]/10 border-[#285C4D]"
                        : "bg-transparent border border-gray-200"
                    )}
                    onClick={() => setActiveFeature(feature)}
                  >
          
                    <div>
                      <p className={cn(
                        "text-xl font-semibold",
                        activeFeature.id === feature.id 
                          ? "text-[#285C4D]" 
                          : "text-gray-900"
                      )}>
                        {feature.title}
                      </p>
                      <p className="text-gray-600 mt-2 text-base">
                        {feature.description}
                      </p>
                    </div>
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default AboutUsMissionVision;