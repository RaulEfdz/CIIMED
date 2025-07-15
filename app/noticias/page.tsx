import NewsCardComponent from '@/components/customs/Cards/NewsCard';

// Type for a single news article
interface Noticia {
  id: number;
  titulo: string;
  contenido: string;
  imagen?: string | null;
  createdAt: Date;
}

// Fetch data from the public API
async function getNoticias(): Promise<Noticia[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/noticias`, {
      next: { revalidate: 600 }, // Revalidate every 10 minutes
    });

    if (!res.ok) {
      throw new Error('Failed to fetch news');
    }

    return res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function NoticiasPage() {
  const noticias = await getNoticias();

  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-10">Últimas Noticias</h1>
      {noticias.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {noticias.map((noticia) => (
            <NewsCardComponent key={noticia.id} noticia={noticia} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No hay noticias disponibles en este momento.</p>
      )}
    </main>
  );
}
