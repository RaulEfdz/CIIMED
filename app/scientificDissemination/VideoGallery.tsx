import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";

interface Video {
  id: string;
  title: string;
  description: string;
  youtubeUrl: string;
}

interface VideoGalleryProps {
  videos?: Video[];
}

export const VideoEmbed: React.FC<{ video: Video; isActive: boolean; onClick: () => void }> = ({ video, isActive, onClick }) => {
  return (
    <Card
      className={`shadow-sm rounded-sm border border-gray-200 transition-all ${isActive ? "scale-105" : "scale-100"}`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">{video.title}</h3>
        <p className="text-sm text-gray-600 mb-2">{video.description}</p>
        <AspectRatio ratio={16 / 9} className="rounded-sm overflow-hidden">
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${new URL(video.youtubeUrl).searchParams.get("v")}`}
            title={video.title}
            allowFullScreen
          />
        </AspectRatio>
      </CardContent>
    </Card>
  );
};

export const VideoGallery: React.FC<VideoGalleryProps> = ({ videos = mockVideos }) => {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  return (
    <div className="flex flex-col">
      <div className="mb-16 text-center">
        <span className="inline-block px-4 py-1 rounded-full text-sm font-medium bg-[#285C4D] text-white mb-4">
          <span className="w-2 h-2 rounded-full bg-[#F4633A]"></span>
          Canal de divulgacion
        </span>
        <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl mb-4">YouTube</h1>
        <div className="w-24 h-1 bg-[#285C4D] mx-auto rounded-full"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        {videos.map((video) => (
          <VideoEmbed
            key={video.id}
            video={video}
            isActive={activeVideo === video.id}
            onClick={() => setActiveVideo(video.id)}
          />
        ))}
      </div>
    </div>
  );
};

export const mockVideos: Video[] =  [
  {
    id: "1",
    title: "EP 4 | Serie de investigación en cáncer: Capítulo 2",
    description: "¡Comprometidos con la innovación e impulsados por la investigación!",
    youtubeUrl: "https://www.youtube.com/watch?v=_gGRwwsOaWA",
  },
  {
    id: "2",
    title: "EP 3 | Serie de investigación en cáncer: Capítulo 1",
    description: "¡Comprometidos con la innovación e impulsados por la investigación!",
    youtubeUrl: "https://www.youtube.com/watch?v=5D9Qk2_XU1o",
  },
  {
    id: "3",
    title: "EP 2 | Los nuevos paradigmas de la investigación en ciencias de la salud: Tecnología Médica",
    description: "¡Comprometidos con la innovación e impulsados por la investigación!",
    youtubeUrl: "https://www.youtube.com/watch?v=yOHLiPU6DQU",
  },
  {
    id: "4",
    title: "EP 1 | Los nuevos paradigmas de la investigación en ciencias de la salud: Enfermería",
    description: "¡Comprometidos con la innovación e impulsados por la investigación!",
    youtubeUrl: "https://www.youtube.com/watch?v=VAzkuPgqBB8&t=2s",
  }
];
