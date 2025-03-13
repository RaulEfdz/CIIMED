import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { SpotifyPodcast, mockPodcasts } from "./data";

export const SpotifyEmbed: React.FC<{
  episodeUrl: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ episodeUrl, isActive, onClick }) => {
  return (
    <Card
      className={`shadow-sm rounded-sm border border-gray-200 transition-all ${
        isActive ? "scale-105" : "scale-100"
      }`}
      onClick={onClick}
    >
      <CardContent className="overflow-hidden p-0 rounded-none bottom-none">
        <iframe
          src={`https://open.spotify.com/embed/episode/${
            episodeUrl.split("/episode/")[1]?.split("?")[0]
          }?utm_source=generator`}
          width="100%"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          className="rounded-sm  from-[#f2f2f2] via-white to-[#f2f2f2]  border-gray-50  justify-center flex items-center content-center p-4 pt-6 overflow-hidden h-32"
        ></iframe>
      </CardContent>
    </Card>
  );
};

export const SpotifyGallery: React.FC<{ podcasts?: SpotifyPodcast[] }> = ({
  podcasts = mockPodcasts,
}) => {
  const [activePodcast, setActivePodcast] = useState<string | null>(null);

  return (
    <div className="flex flex-col mt-24 pb-28">
      <div className="mb-16 text-center">
        <span className="inline-block px-4 py-1 rounded-full text-sm font-medium bg-[#285C4D] text-white mb-4">
          Nuestro Podcast
        </span>
        <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl mb-4">
          Spotify Podcasts
        </h1>
        <div className="w-24 h-1 bg-[#285C4D] mx-auto rounded-full"></div>
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

export default SpotifyGallery;