"use client"
import { ArrowUpCircle } from "lucide-react";
import React from "react";

export const TopScroll: React.FC = () => {
  return (
    <button
      onClick={() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
      className="fixed bottom-8 left-8 bg-[#F2F2F2] p-2 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300"
      aria-label="Volver arriba"
    >
      <ArrowUpCircle className="h-6 w-6 text-[#212322]" />
    </button>
  );
};