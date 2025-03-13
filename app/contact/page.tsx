"use client";

import React from "react";
import FormContact from "./FormContact";
import { mapubic } from "./data";

export default function ContactPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <header className="mb-12 text-center mt-24">
        <h1 className="text-4xl font-bold text-gray-900">Contacto</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Ponte en contacto con nuestro equipo. Estamos aquí para responder tus preguntas.
        </p>
      </header>

      <FormContact />

      <div className="rounded-sm overflow-hidden shadow-md">
        <iframe
          src={mapubic}
          width="100%"
          height="450"
          className="border-0"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </main>
  );
}