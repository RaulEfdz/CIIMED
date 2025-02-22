import React from "react";
import Image from "next/image";

interface SocialPlatform {
  name: string;
  logo: string;
  links: { label: string; url: string }[];
  bgColor: string;
}

const socialPlatforms: SocialPlatform[] = [
  {
    name: "Spotify",
    logo: "/spotify-logo.png",
    bgColor: "bg-green-500",
    links: [
      { label: "Escuchar en Spotify", url: "https://spotify.com" },
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
    links: [
      { label: "Seguir en Instagram", url: "https://instagram.com" },
    ],
  },
];

const SocialCardsSection: React.FC = () => {
  return (
    <section className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {socialPlatforms.map((platform) => (
          <div
            key={platform.name}
            className="group flex flex-col h-full bg-[#F2F2F2] border border-gray-200 shadow-sm rounded-xl"
          >
            <div
              className={`h-52 flex flex-col justify-center items-center ${platform.bgColor} rounded-t-xl`}
            >
              <Image
                src={platform.logo}
                alt={`${platform.name} Logo`}
                width={100}
                height={100}
                className="size-28"
              />
            </div>
            <div className="p-4 md:p-6">
              <h3 className="text-xl font-semibold text-gray-800">
                {platform.name}
              </h3>
              <ul className="mt-3 space-y-2">
                {platform.links.map((link) => (
                  <li key={link.url}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SocialCardsSection;
