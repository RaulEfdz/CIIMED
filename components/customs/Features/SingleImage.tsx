import React from "react";
import { CldImage } from "next-cloudinary";

interface Feature {
  text: string;
  bold: string;
  icon: React.ReactNode;
}

interface SingleImageProps {
  imageUrl: string;
  imageAlt: string;
  title: string;
  description: string;
  features: Feature[];
}

export const SingleImage: React.FC<SingleImageProps> = ({
  imageUrl,
  imageAlt,
  title,
  description,
  features,
}) => {
  return (
    <div className="w-full px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto bg-transparent">
          <div className="max-w-7xl mx-auto">

      {/* Grid */}
      <div className="md:grid md:grid-cols-2 md:items-center md:gap-12 xl:gap-32">
        <div>
          <CldImage
           alt={imageAlt}
            src={imageUrl} // Use this sample image or upload your own via the Media Explorer
            width="2048" // Transform the image: auto-crop to square aspect_ratio
            height="1365"
            crop={{
              type: "auto",
              source: true,
            }}
          />
        </div>
        {/* End Col */}

        <div className="mt-5 sm:mt-10 lg:mt-0">
          <div className="space-y-6 sm:space-y-8">
            {/* Title */}
            <div className="space-y-2 md:space-y-4">
              <h2 className="font-bold text-3xl lg:text-4xl text-gray-800 dark:text-neutral-200">
                {title}
              </h2>
              <p className="text-gray-500 dark:text-neutral-500 text-justify">
                {description}
              </p>
            </div>
            {/* End Title */}

            {/* List */}
            <ul className="space-y-2 sm:space-y-4">
              {features.map((item, index) => (
                <li key={index} className="flex gap-x-3">
                  <span className="mt-0.5 size-5 flex justify-center items-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-800/30 dark:text-blue-500">
                    {item.icon}
                  </span>
                  <div className="grow text-justify">
                    <span className="text-sm sm:text-base text-gray-500 dark:text-neutral-500 ">
                      {item.bold ? (
                        <span className="font-bold">{item.bold}</span>
                      ) : null}{" "}
                      {item.text}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
            {/* End List */}
          </div>
        </div>
        {/* End Col */}
      </div>
      {/* End Grid */}
    </div>    </div>
  );
};

SingleImage.displayName = "SingleImage";
