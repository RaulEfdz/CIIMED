import SafeImage from "@/components/admin/SafeImage";

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
    <header className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <SafeImage 
          src={imageUrl}
          alt={title}
          width={1920}
          height={1080}
          className="absolute inset-0 w-full h-full object-cover object-center"
          fallbackSrc="https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080&q=80"
        />
      </div>
      
      {/* Dynamic Gradient Overlay - Similar al del inicio */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black/70"></div>
      <div className="absolute inset-0" style={{ backgroundColor: overlayColor, mixBlendMode: 'multiply' }}></div>

      {/* Content Container - Positioned at bottom like home */}
      <div className="absolute bottom-0 w-full z-10 pb-8">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex flex-col lg:flex-row justify-between items-end gap-8">
            
            {/* Text Content - Left side */}
            <div className="text-left max-w-2xl">
              {/* Small label */}
              <p className="text-lg md:text-xl text-gray-300 mb-2 uppercase tracking-wider">
                Sobre Nosotros
              </p>
              
              {/* Main Title */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-4">
                {title}
              </h1>
              
              {/* Subtitle */}
              <p className="text-xl md:text-2xl text-gray-200 mb-6">
                {subtitle}
              </p>
              
              {/* Action Buttons */}
              <div className="flex justify-start gap-4">
                {!primaryButton.disabled && (
                  <a
                    href={primaryButton.link}
                    className="inline-block px-6 py-3 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-200 shadow-lg"
                  >
                    {primaryButton.text}
                  </a>
                )}

                {!secondaryButton.disabled && (
                  <a
                    href={secondaryButton.link}
                    className="inline-block px-6 py-3 border border-white text-white font-semibold rounded-lg hover:bg-white hover:text-gray-900 transition-all duration-200"
                  >
                    {secondaryButton.text}
                  </a>
                )}
              </div>
            </div>

            {/* Logo/Highlight - Right side */}
            {highlight && (
              <div className="flex items-end">
                <div className="p-4 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 shadow-lg">
                  <SafeImage 
                    className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full object-cover object-center" 
                    src={highlight} 
                    alt="Logo CIIMED" 
                    width={96} 
                    height={96}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Scroll Indicator - Like home page */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white cursor-pointer z-20">
        <div className="animate-bounce">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </header>
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
