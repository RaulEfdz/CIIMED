// events.ts

import { EventCardProps } from "@/components/customs/Cards/EventCard";
import { UPLOADTHING_IMAGES } from "@/lib/uploadthing-utils";

export const Events: EventCardProps[] = [
  {
    title: "Workshop de Investigación",
    description: "Un workshop interactivo sobre metodologías de investigación.",
    imageUrl: UPLOADTHING_IMAGES.EVENT_IMAGE,
    imageAlt: "Workshop de Investigación",
    imgW: 400,
    imgH: 300,
    link: "/eventos/workshop",
    date: "2025-02-15",
    time: "14:00 - 17:00",
    location: "Auditorio Principal",
    speaker: "Dr. Juan Pérez",
    category: "Workshop"
  },
  {
    title: "Workshop de Investigación",
    description: "Un workshop interactivo sobre metodologías de investigación.",
    imageUrl: UPLOADTHING_IMAGES.EVENT_IMAGE,
    imageAlt: "Workshop de Investigación",
    imgW: 400,
    imgH: 300,
    link: "/eventos/workshop",
    date: "2025-02-15",
    time: "14:00 - 17:00",
    location: "Auditorio Principal",
    speaker: "Dr. Juan Pérez",
    category: "Workshop"
  },
  // ... más eventos
];