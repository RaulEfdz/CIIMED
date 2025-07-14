
// components/customs/Features/Teams.tsx
"use client"
import Image from "next/image";
import { db } from "@/app/data/db";
import TeamMemberCard from "@/components/customs/Cards/TeamMemberCard";

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
                <TeamMemberCard
                  key={index}
                  name={member.name}
                  role={member.role}
                  imageUrl={member.imageUrl}
                  linkedinUrl={member.linkedinUrl}
                  personalWebsite={member.personalWebsite}
                  bio={member.bio}
                />
              ))}
          </div>
        </div>
      ))}
    </section>
  );
}
