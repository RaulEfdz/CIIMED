import { EventCardProps } from "@/components/customs/Cards/EventCard";
import { UPLOADTHING_IMAGES } from "@/lib/uploadthing-utils";
import { Event as EventType } from "@/hooks/useEvents";

// Función para convertir datos de la DB al formato del componente EventCard
export const generateEventCardData = (eventsArray: EventType[]): EventCardProps[] => {
  if (!eventsArray || eventsArray.length === 0) {
    // Datos por defecto si no hay eventos en la DB
    return [
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
    ];
  }

  return eventsArray.map((event) => ({
    title: event.title,
    description: event.description,
    imageUrl: event.imageUrl || UPLOADTHING_IMAGES.EVENT_IMAGE,
    imageAlt: event.imageAlt || event.title,
    imgW: event.imgW || 400,
    imgH: event.imgH || 300,
    link: event.link || `/eventos/${event.slug}`,
    date: event.date,
    time: event.time,
    location: event.location,
    speaker: event.speaker,
    category: event.category
  }));
};

// Datos estáticos como fallback (mantener compatibilidad)
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
];