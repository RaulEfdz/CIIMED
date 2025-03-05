
// components/customs/Features/Teams.tsx
"use client"
import Image from "next/image";
import { db } from "@/app/data/db";

// models/TeamModel.ts

export interface TeamMember {
  name: string;
  role: string;
  imageUrl: string;
  category: string;
  linkedinUrl: string;
  personalWebsite: string;
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
  return (
    <section className="max-w-7xl mx-auto px-6 py-12 lg:py-16 bg-gradient-to-b from-[#f2f2f2] via-white to-[#f2f2f2]">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold" style={{ color: teamColors.primary }}>Nuestro equipo</h2>
        <p style={{ color: teamColors.dark }}>Creative people</p>
      </div>
      {db.categoriesTeam.map((category) => (
        <div key={category} className="mb-10">
          <h3 className="text-2xl font-semibold mb-6" style={{ color: teamColors.primary }}>{category}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {db.team
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
                    I am an ambitious workaholic, but apart from that, pretty simple person.
                  </p>
                  <div className="mt-3 flex gap-3">
                    <a
                      href={member.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                      style={{ color: teamColors.secondary }}
                    >
                      LinkedIn
                    </a>
                    <a
                      href={member.personalWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                      style={{ color: teamColors.secondary }}
                    >
                      Website
                    </a>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </section>
  );
}
