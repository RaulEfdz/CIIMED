import { EventCardProps } from "@/components/customs/Cards/EventCard";
import { UPLOADTHING_IMAGES } from "@/lib/uploadthing-utils";
import { Event as EventType } from "@/hooks/useEvents";

// Función para convertir datos de la DB al formato del componente EventCard
export const generateEventCardData = (eventsArray: EventType[]): EventCardProps[] => {
  // Solo retornar datos de la base de datos - NO HAY FALLBACKS
  if (!eventsArray || eventsArray.length === 0) {
    return [];
  }

  return eventsArray.map((event) => ({
    title: event.title,
    description: event.description,
    imageUrl: event.imageUrl || '', // Solo imagen de Supabase, sin placeholder
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

// Ya no hay datos estáticos - todo viene de la base de datos