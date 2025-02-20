import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface SpotifyPodcast {
  id: string;
  title: string;
  episodeUrl: string;
}

interface SpotifyGalleryProps {
  podcasts?: SpotifyPodcast[];
}

export const SpotifyEmbed: React.FC<{ episodeUrl: string; isActive: boolean; onClick: () => void }> = ({ episodeUrl, isActive, onClick }) => {
  return (
    <Card
      className={`shadow-sm rounded-sm border border-gray-200 transition-all ${isActive ? "scale-105" : "scale-100"}`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <iframe
          src={`https://open.spotify.com/embed/episode/${episodeUrl.split("/episode/")[1]?.split("?")[0]}/video?utm_source=generator`}
          width="100%"
          height={isActive ? "400" : "351"}
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          className="rounded-sm"
        ></iframe>
      </CardContent>
    </Card>
  );
};

export const SpotifyGallery: React.FC<SpotifyGalleryProps> = ({ podcasts = mockPodcasts }) => {
  const [activePodcast, setActivePodcast] = useState<string | null>(null);

  return (
    <div className="flex flex-col mt-24">
      <div className="mb-16 text-center">
        <span className="inline-block px-4 py-1 rounded-full text-sm font-medium bg-[#1DB954] text-white mb-4">
          Nuestro Podcast
        </span>
        <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl mb-4">
          Spotify Podcasts
        </h1>
        <div className="w-24 h-1 bg-[#1DB954] mx-auto rounded-full"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        {podcasts.map((podcast) => (
          <SpotifyEmbed
            key={podcast.id}
            episodeUrl={podcast.episodeUrl}
            isActive={activePodcast === podcast.id}
            onClick={() => setActivePodcast(podcast.id)}
          />
        ))}
      </div>
    </div>
  );
};

export const mockPodcasts: SpotifyPodcast[] = [
  {
    id: "1",
    title: "Episodio 1 - Introducción",
    episodeUrl: "https://open.spotify.com/episode/4OZIwspKDk3i03zNtDb2iY",
  },
  {
    id: "2",
    title: "Episodio 2 - Innovación en la Ciencia",
    episodeUrl: "https://open.spotify.com/episode/7qTGaHe5ie1n2KPvkICxBu",
  },
  {
    id: "3",
    title: "Episodio 3 - Futuro de la Tecnología",
    episodeUrl: "https://open.spotify.com/episode/52oY8Bs0aUQTTM3vPa2jfI",
  },
  {
    id: "4",
    title: "Episodio 4 - Nuevas Fronteras",
    episodeUrl: "https://open.spotify.com/episode/2LTAdiO3pIApiZF8kHDSNk",
  },
];
