import Image from 'next/image';
import Link from 'next/link';

// Define the type for a single Banner based on the Prisma model
interface Banner {
  id: number;
  titulo?: string | null;
  imagen: string;
  link?: string | null;
}

// Define the props for the HeroSection component
interface HeroSectionProps {
  banners: Banner[];
}

const HeroSectionComponent = ({ banners }: HeroSectionProps) => {
  if (!banners || banners.length === 0) {
    return (
      <section className="flex items-center justify-center h-96 bg-gray-200">
        <p className="text-gray-500">No hay banners para mostrar.</p>
      </section>
    );
  }

  // For simplicity, this component will display the first active banner.
  // A more advanced implementation could use a carousel.
  const banner = banners[0];

  return (
    <section className="relative w-full h-[60vh] md:h-[80vh]">
      <Image
        src={banner.imagen}
        alt={banner.titulo || 'Banner principal'}
        fill
        style={{objectFit: "cover"}}
        priority
      />
      <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-center text-white p-4">
        {banner.titulo && (
          <h1 className="text-4xl md:text-6xl font-bold mb-4">{banner.titulo}</h1>
        )}
        {banner.link && (
          <Link href={banner.link} className="mt-4 px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
              Ver más
          </Link>
        )}
      </div>
    </section>
  );
};

export default HeroSectionComponent;
