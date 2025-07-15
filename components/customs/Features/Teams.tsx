// components/customs/Features/Teams.tsx

import TeamMemberCard from "@/components/customs/Cards/TeamMemberCard";
import prisma from '@/app/lib/prisma';
// Ya no necesitas importar 'db' de los datos moqueados.

// Definimos los colores aquí o los importamos si se usan en otros lugares.
const teamColors = {
  primary: "#285C4D",
  secondary: "#F4633A",
  dark: "#212322",
  light: "#f2f2f2"
};

// Convertimos el componente en un Server Component asíncrono.
// Ya no se necesita "use client".
export default async function Team() {
  // 1. Obtener todos los miembros del equipo activos desde la base de datos.
  const teamMembers = await prisma.equipoDeTrabajo.findMany({
    where: {
      activo: true, // Filtramos solo los miembros activos.
    },
    orderBy: {
      createdAt: 'asc', // Opcional: ordenarlos por fecha de creación.
    },
  });

  // 2. Extraer las categorías únicas directamente de los datos obtenidos.
  const categories = [...new Set(teamMembers.map((member) => member.categoria))];

  return (
    <section className="max-w-7xl mx-auto px-6 py-12 lg:py-16 bg-gradient-to-b from-[#f2f2f2] via-white to-[#f2f2f2]">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold" style={{ color: teamColors.primary }}>Nuestro equipo</h2>
        <p style={{ color: teamColors.dark }}>Creative people</p>
      </div>
      
      {/* 3. Iterar sobre las categorías dinámicas */}
      {categories.map((category) => (
        <div key={category} className="mb-10">
          <h3 className="text-2xl font-semibold mb-6" style={{ color: teamColors.primary }}>{category}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers
              .filter((member) => member.categoria === category)
              .map((member) => (
                // 4. Mapear los datos de la BD a las props del componente Card.
                <TeamMemberCard
                  key={member.id} // Usamos el 'id' de la base de datos como key.
                  name={member.nombre}
                  role={member.puesto}
                  imageUrl={member.imagenUrl}
                  linkedinUrl={member.linkedinUrl || ""}
                  personalWebsite={member.personalWebsite || ""}
                  bio={member.bio || ""}
                />
              ))}
          </div>
        </div>
      ))}
    </section>
  );
}
