// components/customs/Features/SingleImage.tsx
import { CldImage } from "next-cloudinary";
import { ReactNode } from "react";

interface Feature {
  text: string;
  bold?: string;
  icon: ReactNode;
}

interface SingleImageProps {
  imageUrl: string;
  imageAlt: string;
  title: string;
  description: string;
  features: Feature[];
}

const colors = {
  primary: "#285C4D",
  secondary: "#F4633A",
  dark: "#212322",
  light: "#f2f2f2"
};

export const SingleImage: React.FC<SingleImageProps> = ({
  imageUrl,
  imageAlt,
  title,
  description,
  features,
}) => {
  return (
    <div className="w-full px-6 py-12 lg:py-16 bg-transparent">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <CldImage
          alt={imageAlt}
          src={imageUrl}
          width="2048"
          height="1365"
          className="rounded-sm shadow-md"
        />
        <div className="space-y-6">
          <h2 className="text-3xl lg:text-4xl font-bold" style={{ color: colors.primary }}>{title}</h2>
          <p className="text-justify" style={{ color: colors.dark }}>{description}</p>
          <ul className="space-y-4">
            {features.map((item, index) => (
              <li key={index} className="flex items-center gap-3">
                <div className="flex items-center justify-center size-12 rounded-full mb-4" style={{ backgroundColor: colors.light }}>
                  {item.icon}
                </div>
                <span className="text-sm sm:text-base" style={{ color: colors.dark }}>
                  {item.bold && <strong className="font-bold">{item.bold} </strong>}
                  {item.text}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

SingleImage.displayName = "SingleImage";