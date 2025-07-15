import Image from 'next/image';
import Link from 'next/link';

// Type for a single team member
interface TeamMember {
  id: number;
  nombre: string;
  puesto: string;
  imagenUrl?: string | null;
  linkedinUrl?: string | null;
}

// Props for the TeamSection component
interface TeamSectionProps {
  team: TeamMember[];
}

const TeamSectionComponent = ({ team }: TeamSectionProps) => {
  if (!team || team.length === 0) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-500">El equipo de trabajo no está disponible actualmente.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Nuestro Equipo</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {team.map((member) => (
            <div key={member.id} className="bg-gray-50 rounded-lg shadow-md p-6 text-center">
              <div className="relative w-32 h-32 mx-auto mb-4">
                <Image
                  src={member.imagenUrl || '/default-profile.png'} // Provide a default image
                  alt={`Foto de ${member.nombre}`}
                  fill
                  style={{objectFit: "cover"}}
                  className="rounded-full"
                />
              </div>
              <h3 className="text-xl font-semibold">{member.nombre}</h3>
              <p className="text-gray-600 mb-2">{member.puesto}</p>
              {member.linkedinUrl && (
                <Link href={member.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700">
                  LinkedIn
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSectionComponent;
