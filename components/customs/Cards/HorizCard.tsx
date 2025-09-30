import Image from "next/image";
import React from "react";

export interface HorizCardProps {
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  imgW: number;
  imgH: number;
  link: string;
}

const HorizCard: React.FC<HorizCardProps> = ({
  title,
  description,
  imageUrl,
  link,
  imageAlt,
  imgH,
  imgW,
}) => {
  return (
    <a
      href={link}
      className="block border border-gray-200 rounded-sm hover:shadow-sm focus:outline-none dark:border-neutral-700"
    >
      <div className="relative flex items-center overflow-hidden">
        <Image
          className="w-32 sm:w-48 h-full absolute inset-0 object-cover rounded-s-lg"
          alt={imageAlt}
          src={imageUrl}
          width={imgW}
          height={imgH}
        />

        <div className="grow p-4 ms-32 sm:ms-48">
          <div className="min-h-24 flex flex-col justify-center">
            <h3 className="font-semibold text-sm text-gray-800 dark:text-neutral-300">
              {title}
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-neutral-500">
              {description}
            </p>
          </div>
        </div>
      </div>
    </a>
  );
};

export default HorizCard;
