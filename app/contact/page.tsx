"use client";

import React from "react";
import HireUs, { HireUsContent } from "@/components/customs/feedBack/HireUs";

const mapubic = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.9933733942776!2d-79.53632542397723!3d8.97275568986472!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8faca8c1954bfe75%3A0x2874244d550d2e58!2sHospital%20Nacional!5e0!3m2!1ses!2spa!4v1739394007363!5m2!1ses!2spa"

const FormContact = () => {
  const allianceContent: HireUsContent = {
    title: "Contacto | Centro de Atención",
    subtitle: "Conéctate con nosotros para más información",
    description:
      "Estamos aquí para responder tus preguntas y brindarte la mejor atención. Completa el siguiente formulario y nos pondremos en contacto contigo lo antes posible.",
    expectations: [
      "Atención personalizada",
      "Respuestas rápidas y efectivas",
      "Soporte en todo momento"
    ],
    form: {
      title: "Formulario de Contacto",
      namePlaceholder: "Tu Nombre",
      lastNamePlaceholder: "Tu Apellido",
      emailPlaceholder: "Tu Correo Electrónico",
      messagePlaceholder: "Escribe tu mensaje",
      submitButton: "Enviar Mensaje"
    }
  };

  return <HireUs content={allianceContent} />;
};

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
