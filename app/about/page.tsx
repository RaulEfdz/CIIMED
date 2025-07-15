import TeamSectionComponent from '@/app/pages/shared/TeamSection/TeamSectionComponent';

// Type for a single team member
interface TeamMember {
  id: number;
  nombre: string;
  puesto: string;
  imagenUrl?: string | null;
  linkedinUrl?: string | null;
}

// Fetch data from the public API
async function getTeam(): Promise<TeamMember[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/staff`, {
      next: { revalidate: 3600 }, // Revalidate data every hour
    });

    if (!res.ok) {
      throw new Error('Failed to fetch team data');
    }

    return res.json();
  } catch (error) {
    console.error(error);
    return []; // Return an empty array on error
  }
}

export default async function AboutPage() {
  const team = await getTeam();

  return (
    <main>
      {/* You can add a hero section or other content here */}
      <TeamSectionComponent team={team} />
    </main>
  );
}