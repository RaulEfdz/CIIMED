import Image from 'next/image';

// Type for a single news article
interface Noticia {
  id: number;
  titulo: string;
  contenido: string;
  imagen?: string | null;
  createdAt: Date;
}

// Fetch data for a single news article
async function getNoticia(id: string): Promise<Noticia | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/noticias/${id}`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (!res.ok) {
      // This will be caught by the error boundary or notFound()
      return null;
    }

    return res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default async function NoticiaDetailPage({ params }: { params: { id: string } }) {
  const noticia = await getNoticia(params.id);

  if (!noticia) {
    return (
        <div className="container mx-auto px-4 py-12 text-center">
            <h1 className="text-3xl font-bold">Noticia no encontrada</h1>
            <p className="text-gray-500 mt-4">La noticia que buscas no existe o no está disponible.</p>
        </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-12">
      <article>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{noticia.titulo}</h1>
        <p className="text-gray-500 mb-8">Publicado el {new Date(noticia.createdAt).toLocaleDateString()}</p>
        
        {noticia.imagen && (
          <div className="relative h-96 w-full mb-8">
            <Image
              src={noticia.imagen}
              alt={`Imagen de ${noticia.titulo}`}
              fill
              style={{objectFit: "cover"}}
              className="rounded-lg"
            />
          </div>
        )}

        {/* Render rich text content safely */}
        <div 
          className="prose lg:prose-xl max-w-none"
          dangerouslySetInnerHTML={{ __html: noticia.contenido }}
        />
      </article>
    </main>
  );
}
