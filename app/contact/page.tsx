import SucursalCardComponent from '@/components/customs/Cards/SucursalCard';
import FAQCardComponent from '@/components/customs/Cards/FAQCard';

// Type for a single branch
interface Sucursal {
  id: number;
  nombre: string;
  direccion: string;
  telefono?: string | null;
  horario?: string | null;
  mapaUrl?: string | null;
}

// Type for a single FAQ item
interface FAQ {
  id: number;
  pregunta: string;
  respuesta: string;
}

// Fetch branches data
async function getSucursales(): Promise<Sucursal[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/sucursales`, {
      next: { revalidate: 86400 }, // Revalidate once a day
    });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

// Fetch FAQs data
async function getFaqs(): Promise<FAQ[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/faq`, {
      next: { revalidate: 86400 }, // Revalidate once a day
    });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function ContactPage() {
  const [sucursales, faqs] = await Promise.all([getSucursales(), getFaqs()]);

  return (
    <main className="container mx-auto px-4 py-12">
      {/* Sucursales Section */}
      <section className="mb-16">
        <h1 className="text-4xl font-bold text-center mb-10">Nuestras Sucursales</h1>
        {sucursales.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {sucursales.map((sucursal) => (
              <SucursalCardComponent key={sucursal.id} sucursal={sucursal} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No hay sucursales disponibles.</p>
        )}
      </section>

      {/* FAQ Section */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-10">Preguntas Frecuentes</h2>
        {faqs.length > 0 ? (
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq) => (
              <FAQCardComponent key={faq.id} faq={faq} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No hay preguntas frecuentes disponibles.</p>
        )}
      </section>
    </main>
  );
}