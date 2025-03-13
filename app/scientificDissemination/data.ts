// data.ts

export interface ButtonData {
  text: string;
  link: string;
  disabled: boolean;
}

export interface HeroData {
  title: string;
  subtitle: string;
  imageUrl: string;
  primaryButton: ButtonData;
  secondaryButton: ButtonData;
  overlayColor: string;
  highlight: string;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  youtubeUrl: string;
}

export interface SpotifyPodcast {
  id: string;
  title: string;
  episodeUrl: string;
}

export interface SocialLink {
  platform: string;
  url: string;
}

export interface SocialPlatform {
  name: string;
  logo: string;
  links: { label: string; url: string }[];
  bgColor: string;
}

export interface InstagramPost {
  id: string;
  caption: string;
  postUrl: string;
}

export const heroScientificDisseminationData: HeroData = {
  title: "Divulgación y Comunicación Científica",
  subtitle: "Acercando la ciencia a todos con claridad e impacto",
  imageUrl: "https://cdn.pixabay.com/photo/2016/11/29/03/53/camera-1867184_1280.jpg",
  primaryButton: { text: "Comenzar ahora", link: "#", disabled: true },
  secondaryButton: { text: "Ver tour", link: "#", disabled: true },
  overlayColor: "#285C4D",
  highlight: "/highlights/Comunidad.png",
};

export const mockVideos: Video[] = [
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
  },
];

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

export const socialPlatformsData: SocialPlatform[] = [
  {
    name: "Spotify",
    logo: "/spotify-logo.png",
    bgColor: "bg-green-500",
    links: [
      {
        label: "Escuchar en Spotify",
        url: "https://spotify.com",
      },
    ],
  },
  {
    name: "YouTube",
    logo: "/youtube-logo.png",
    bgColor: "bg-red-500",
    links: [
      { label: "Ver en YouTube", url: "https://youtube.com" },
    ],
  },
  {
    name: "Instagram",
    logo: "/instagram-logo.png",
    bgColor: "bg-pink-500",
    links: [{ label: "Seguir en Instagram", url: "https://instagram.com" }],
  },
];

export const mockPosts: InstagramPost[] = [
  {
    id: "1",
    caption: "¡Nueva publicación en nuestro Instagram! 📸✨",
    postUrl:
      "https://www.instagram.com/reel/DBjTpwERplD/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
  },
  {
    id: "3",
    caption: "Síguenos para más contenido exclusivo. 🚀",
    postUrl:
      "https://www.instagram.com/reel/DFOXWQUpSUP/?utm_source=ig_web_button_share_sheet&igsh=MzRlODBiNWFlZA==",
  },
  {
    id: "2",
    caption: "Síguenos para más contenido exclusivo. 🚀",
    postUrl:
      "https://www.instagram.com/reel/DBzc8MLpDlW/?utm_source=ig_web_button_share_sheet&igsh=MzRlODBiNWFlZA==",
  },
];