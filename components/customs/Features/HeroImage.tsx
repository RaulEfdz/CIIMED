"use client"

import Image from "next/image";

interface HeroImagenProps {
  title: string;
  subtitle: string;
  imageUrl: string;
  overlayColor: string;
  primaryButton: {
    text: string;
    link: string;
    disabled?: boolean;
  };
  secondaryButton: {
    text: string;
    link: string;
    disabled?: boolean;
  };
  highlight: string;
}

export default function HeroImagen({
  title,
  subtitle,
  imageUrl,
  overlayColor,
  primaryButton,
  secondaryButton,
  highlight
}: HeroImagenProps) {
  return (
    <section className="min-h-96 relative flex flex-1 shrink-0 items-center justify-center overflow-hidden rounded-none bg-gray-100 py-16 shadow-lg md:py-20 xl:py-48">
      {/* Image - start */}
      <Image 
        src={imageUrl}
        alt={title}
        layout="fill"
        objectFit="cover"
        objectPosition="center"
        className="absolute inset-0"
        priority
      />
      {/* Image - end */}

      {/* Overlay - start */}
      <div className="absolute inset-0" style={{ backgroundColor: overlayColor, mixBlendMode: 'multiply' }}></div>
      {/* Overlay - end */}

      {/* Text - start */}
      <div className="relative flex flex-col items-center p-4 sm:max-w-xl">
      {highlight && <Image className="w-24 h-24" src={highlight} alt={"Highlight"} height={100} width={100}/> }

      <h1 className="mb-8 text-center text-4xl font-bold text-white sm:text-5xl md:mb-12 md:text-6xl uppercase">
          {title}
        </h1>
        <p className="mb-4 text-center text-lg text-gray-100 sm:text-xl md:mb-8">
          {subtitle}
        </p>


        <div className="flex w-full flex-col gap-2.5 sm:flex-row sm:justify-center">
          {!primaryButton.disabled && (
            <a
              href={primaryButton.link}
              className="inline-block rounded-none bg-indigo-500 px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-indigo-300 transition duration-100 hover:bg-indigo-600 focus-visible:ring active:bg-indigo-700 md:text-base"
            >
              {primaryButton.text}
            </a>
          )}

          {!secondaryButton.disabled && (
            <a
              href={secondaryButton.link}
              className="inline-block rounded-none bg-gray-200 px-8 py-3 text-center text-sm font-semibold text-gray-500 outline-none ring-indigo-300 transition duration-100 hover:bg-gray-300 focus-visible:ring active:text-gray-700 md:text-base"
            >
              {secondaryButton.text}
            </a>
          )}
        </div>
      </div>
      {/* Text - end */}
    </section>
  );
}

// Ejemplo de uso:
{/* <HeroImagen 
  title="Construyendo el Futuro de la Web" 
  subtitle="Innovación y tecnología al alcance de todos" 
  imageUrl="https://images.unsplash.com/photo-1618004652321-13a63e576b80?auto=format&q=75&fit=crop&w=1500" 
  overlayColor="#285C4D"
  primaryButton={{ text: "Comenzar ahora", link: "#", disabled: false }} 
  secondaryButton={{ text: "Ver tour", link: "#", disabled: true }} 
/> */}
