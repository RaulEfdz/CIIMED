"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircleIcon } from "lucide-react";

// Definición del modelo para el contenido
export interface HireUsContent {
  title: string;
  subtitle: string;
  description: string;
  expectations: string[];
  form: {
    title: string;
    namePlaceholder: string;
    lastNamePlaceholder: string;
    emailPlaceholder: string;
    messagePlaceholder: string;
    submitButton: string;
  };
}

interface HireUsProps {
  content: HireUsContent;
}

export default function HireUs({ content }: HireUsProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid md:grid-cols-2 items-center gap-12">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl mb-4">
            {content.title}
          </h1>
          <p className="text-lg text-gray-700">{content.subtitle}</p>
          <p className="mt-4 text-gray-600">{content.description}</p>
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-900">
              ¿Qué puedes consultar?
            </h2>
            <ul className="mt-2 space-y-2">
              {content.expectations.map((item, index) => (
                <li key={index} className="flex gap-x-3">
                  <MessageCircleIcon className="h-5 w-5 text-[#285C4D]" />
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="relative">
          <Card className="rounded-sm shadow-md bg-[#F2F2F2]">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                {content.form.title}
              </h2>
              <form className="mt-6 grid gap-4 lg:gap-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                  <input
                    type="text"
                    placeholder={content.form.namePlaceholder}
                    className="py-3 px-4 border rounded-sm text-sm"
                  />
                  <input
                    type="text"
                    placeholder={content.form.lastNamePlaceholder}
                    className="py-3 px-4 border rounded-sm text-sm"
                  />
                </div>
                <input
                  type="email"
                  placeholder={content.form.emailPlaceholder}
                  className="py-3 px-4 border rounded-sm text-sm"
                />
                <textarea
                  placeholder={content.form.messagePlaceholder}
                  className="py-3 px-4 border rounded-sm text-sm"
                  rows={4}
                ></textarea>
                <button
                  type="submit"
                  className="w-full py-3 px-4 text-sm font-medium rounded-sm bg-[#285C4D] text-white hover:bg-[#285C4D]"
                >
                  {content.form.submitButton}
                </button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
