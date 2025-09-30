
// components/customs/Features/Teams.tsx
"use client"
import Image from "next/image";
import { db } from "@/app/data/db";
import { useState, useEffect } from "react";

// models/TeamModel.ts

export interface TeamMember {
  name: string;
  role: string;
  imageUrl: string;
  category: string;
  linkedinUrl: string;
  personalWebsite: string;
  bio?: string;
}

interface DBTeamMember {
  id: string;
  name: string;
  position: string;
  department: string;
  email?: string;
  phone?: string;
  bio?: string;
  avatar?: string;
  linkedIn?: string;
  website?: string;
  specialties: string[];
  status: string;
  type: string;
  order: number;
}

export interface TeamData {
  categoriesTeam: string[];
  team: TeamMember[];
}

const teamColors = {
  primary: "#285C4D",
  secondary: "#F4633A",
  dark: "#212322",
  light: "#f2f2f2"
};

export default function Team() {
  const [teamData, setTeamData] = useState<TeamMember[]>(db.team);
  const [categories] = useState<string[]>(["Directivos", "Investigadores", "Colaboradores"]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTeamData();
  }, []);

  const fetchTeamData = async () => {
    try {
      // Usar URL absoluta si estamos en el navegador
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
      const response = await fetch(`${baseUrl}/api/team`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.teamMembers && Array.isArray(data.teamMembers)) {
          const convertedTeam = convertDBToTeamFormat(data.teamMembers);
          setTeamData(convertedTeam);
        } else {
          // Fallback to static data if no members
          setTeamData(db.team);
        }
      } else {
        // Fallback to static data
        console.log('API error, using static team data as fallback');
        setTeamData(db.team);
      }
    } catch (error) {
      console.error('Error fetching team data:', error);
      // Fallback to static data
      setTeamData(db.team);
    } finally {
      setIsLoading(false);
    }
  };

  const convertDBToTeamFormat = (dbMembers: DBTeamMember[]): TeamMember[] => {
    if (!Array.isArray(dbMembers)) {
      return [];
    }
    
    return dbMembers.map(member => ({
      name: member?.name || 'Nombre no disponible',
      role: member?.position || 'Posición no disponible',
      imageUrl: member?.avatar || `https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=320&h=320&q=80`,
      category: typeToCategory(member?.type || 'STAFF'),
      linkedinUrl: member?.linkedIn && member.linkedIn.trim() ? member.linkedIn : '#',
      personalWebsite: member?.website && member.website.trim() ? member.website : '#',
      bio: member?.bio || 'Miembro destacado del equipo CIIMED.'
    }));
  };

  const typeToCategory = (type: string): string => {
    switch (type.toUpperCase()) {
      case 'DIRECTOR': return 'Directivos';
      case 'RESEARCHER': return 'Investigadores';
      case 'COLLABORATOR': return 'Colaboradores';
      case 'STAFF': return 'Colaboradores';
      default: return 'Colaboradores';
    }
  };

  if (isLoading) {
    return (
      <section className="max-w-7xl mx-auto px-6 py-12 lg:py-16 bg-gradient-to-b from-[#f2f2f2] via-white to-[#f2f2f2]">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold" style={{ color: teamColors.primary }}>Nuestro equipo</h2>
          <div className="animate-pulse mt-4">Cargando equipo...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-6 py-12 lg:py-16 bg-gradient-to-b from-[#f2f2f2] via-white to-[#f2f2f2]">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold" style={{ color: teamColors.primary }}>Nuestro equipo</h2>
        <p style={{ color: teamColors.dark }}>Creative people</p>
      </div>
      {categories.map((category) => (
        <div key={category} className="mb-10">
          <h3 className="text-2xl font-semibold mb-6" style={{ color: teamColors.primary }}>{category}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamData
              .filter((member) => member.category === category)
              .map((member, index) => (
                <div
                  key={index}
                  className="flex flex-col  dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-sm p-6 shadow-md "
                >
                  <div className="flex items-center gap-4">
                    <Image
                      src={member.imageUrl}
                      alt={`Imagen de ${member.name}`}
                      width={80}
                      height={80}
                      className="rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-medium" style={{ color: teamColors.dark }}>{member.name}</h3>
                      <p className="text-xs uppercase text-gray-500 dark:text-neutral-400">
                        {member.role}
                      </p>
                    </div>
                  </div>
                  <p className="mt-3" style={{ color: teamColors.dark }}>
                    {member.bio || "I am an ambitious workaholic, but apart from that, pretty simple person."}
                  </p>
                  <div className="mt-3 flex gap-3">
                    {member.linkedinUrl && member.linkedinUrl !== '#' && (
                      <a
                        href={member.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                        style={{ color: teamColors.secondary }}
                      >
                        LinkedIn
                      </a>
                    )}
                    {member.personalWebsite && member.personalWebsite !== '#' && (
                      <a
                        href={member.personalWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                        style={{ color: teamColors.secondary }}
                      >
                        Website
                      </a>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </section>
  );
}
