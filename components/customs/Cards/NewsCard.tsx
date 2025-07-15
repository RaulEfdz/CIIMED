import Image from 'next/image';
import Link from 'next/link';

// Type for a single news article
interface Noticia {
  id: number;
  titulo: string;
  contenido: string;
  imagen?: string | null;
  createdAt: Date;
}

// Props for the NewsCard component
interface NewsCardProps {
  noticia: Noticia;
}

const NewsCardComponent = ({ noticia }: NewsCardProps) => {
  const summary = noticia.contenido.substring(0, 100) + '...'; // Simple summary

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
      <Link href={`/noticias/${noticia.id}`}>
        <div className="relative h-48 w-full">
          <Image
            src={noticia.imagen || '/default-news.jpg'} // Provide a default image
            alt={`Imagen de ${noticia.titulo}`}
            fill
            style={{objectFit: "cover"}}
          />
        </div>
        <div className="p-6">
          <h3 className="text-xl font-bold mb-2">{noticia.titulo}</h3>
          <p className="text-gray-700 mb-4">{summary}</p>
          <p className="text-sm text-gray-500">{new Date(noticia.createdAt).toLocaleDateString()}</p>
        </div>
      </Link>
    </div>
  );
};

export default NewsCardComponent;