"use client";

import News from "@/components/customs/Features/News";
import { db } from "@/app/lib/db";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import EventsContainer from "@/components/customs/Features/Events";
import Team from "@/components/customs/Features/Teams";
import { HeroSection } from "./HeroSection";
import { FeatureInit } from "./FeatureInit";
import { NewsCardProps } from "@/components/customs/Cards/NewsCard";
import { EventCardProps } from "@/components/customs/Cards/EventCard";

// export const HIGHLIGHT_COLOR = "#ffffff";

export default function Home() {
  const [news, setNews] = useState<NewsCardProps[]>([]);
  const [events, setEvents] = useState<EventCardProps[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const newsData = await db.noticia.findMany({
          where: { publicado: true },
          orderBy: { createdAt: 'desc' },
          take: 3
        });
        
        const formattedNews = newsData.map((n): NewsCardProps => ({
          title: n.titulo,
          description: n.contenido,
          imageUrl: n.imagen || '/default-news.jpg',
          imageAlt: n.titulo,
          imgW: 800,
          imgH: 600,
          link: `/news/${n.id}`
        }));
        setNews(formattedNews);

        const eventsData = await db.sucursal.findMany({
          where: { activo: true },
          orderBy: { createdAt: 'asc' },
          take: 3
        });
        
        const formattedEvents = eventsData.map((e): EventCardProps => ({
          title: e.nombre,
          description: e.direccion,
          imageUrl: e.mapaUrl || '/default-event.jpg',
          imageAlt: e.nombre,
          imgW: 800,
          imgH: 600,
          link: `/event/${e.id}`
        }));
        setEvents(formattedEvents);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="w-full h-full bg-gradient-to-b from-[#f2f2f2] via-white to-[#f2f2f2]">
        <HeroSection />

        <FeatureInit />

      <motion.section
        className=""
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <Team />
      </motion.section>

      <motion.section
        className=""
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <News news={news} />
      </motion.section>

      <motion.section
        className=""
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <EventsContainer events={events} />
      </motion.section>
    </div>
  );
}
