import HeroSectionComponent from '@/components/customs/Heros/HeroSectionComponent';

// Define the type for a single Banner based on the Prisma model
interface Banner {
  id: number;
  titulo?: string | null;
  imagen: string;
  link?: string | null;
}

// Fetch data from the public API
async function getBanners(): Promise<Banner[]> {
  try {
    // NOTE: Using an absolute URL is best practice in Server Components,
    // especially if your app is deployed on a different domain than your API.
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/banners`, {
      next: { revalidate: 3600 }, // Revalidate data every hour
    });

    if (!res.ok) {
      throw new Error('Failed to fetch banners');
    }

    return res.json();
  } catch (error) {
    console.error(error);
    return []; // Return an empty array on error
  }
}

export default async function HomePage() {
  const banners = await getBanners();

  return (
    <main>
      <HeroSectionComponent banners={banners} />
      {/* Other sections of the homepage can be added here */}
    </main>
  );
}