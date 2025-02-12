
import Image from 'next/image';
import clsx from 'clsx';

type ResearchStatus = 'Completado' | 'En curso' | 'En reclutamiento' | 'En análisis';

interface ResearchItem {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  status: ResearchStatus;
  type?: 'project' | 'investigation';
}

const researchItems: ResearchItem[] = [
  {
    id: 1,
    type: 'project',
    title: "Desarrollo de una nueva terapia génica para la enfermedad X",
    description: "Este proyecto tiene como objetivo desarrollar una terapia génica innovadora para tratar la enfermedad X, una condición médica con necesidades insatisfechas.",
    imageUrl: "https://cdn.pixabay.com/photo/2018/11/20/16/44/laboratory-3827745_1280.jpg",
    status: "En curso",
  },
  {
    id: 2,
    type: 'project',
    title: "Investigación sobre biomarcadores para la detección precoz del cáncer Y",
    description: "Esta investigación se centra en la identificación de nuevos biomarcadores que permitan la detección precoz del cáncer Y, mejorando las opciones de tratamiento.",
    imageUrl: "https://cdn.pixabay.com/photo/2018/11/20/16/44/laboratory-3827745_1280.jpg",
    status: "Completado",
  },
  {
    id: 3,
    type: 'investigation',
    title: "Estudio clínico fase III sobre la eficacia del fármaco Z",
    description: "Un estudio clínico fase III para evaluar la eficacia y seguridad del fármaco Z en pacientes con la condición médica W.",
    imageUrl: "https://cdn.pixabay.com/photo/2018/11/20/16/44/laboratory-3827745_1280.jpg",
    status: "En reclutamiento",
  },
  {
    id: 4,
    type: 'investigation',
    title: "Análisis genómico de cohortes de pacientes con enfermedades raras",
    description: "Esta investigación utiliza el análisis genómico para comprender mejor las bases genéticas de las enfermedades raras y identificar posibles dianas terapéuticas.",
    imageUrl: "https://cdn.pixabay.com/photo/2018/11/20/16/44/laboratory-3827745_1280.jpg",
    status: "En análisis",
  },
];

async function getResearchData() {
  return {
    projects: researchItems.filter(item => item.type === 'project'),
    investigations: researchItems.filter(item => item.type === 'investigation')
  };
}

const StatusBadge = ({ status }: { status: ResearchStatus }) => {
  const statusColors: Record<ResearchStatus, string> = {
    'Completado': 'bg-green-100 text-green-800',
    'En curso': 'bg-blue-100 text-blue-800',
    'En reclutamiento': 'bg-yellow-100 text-yellow-800',
    'En análisis': 'bg-purple-100 text-purple-800',
  };

  return (
    <span className={clsx(
      "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium",
      statusColors[status]
    )}>
      {status}
    </span>
  );
};

const ResearchCard = ({ item }: { item: ResearchItem }) => (
  <article className="flex flex-col md:flex-row gap-6 p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow ">
    {item.imageUrl && (
      <div className="relative w-full md:w-64 h-48 shrink-0">
        <Image
          src={item.imageUrl}
          alt={`Imagen de ${item.title}`}
          fill
          className="rounded-lg object-cover"
          sizes="(max-width: 768px) 100vw, 256px"
          loading="lazy"
        />
      </div>
    )}
    
    <div className="flex-1">
      <h3 className="text-xl font-semibold mb-3 text-gray-900">{item.title}</h3>
      <p className="mb-4 text-gray-600 leading-relaxed">{item.description}</p>
      <div className="flex items-center justify-between">
        <StatusBadge status={item.status} />
        <span className="text-sm text-gray-500">#{item.id.toString().padStart(2, '0')}</span>
      </div>
    </div>
  </article>
);

export default async function ResearchPage() {
  const { projects, investigations } = await getResearchData();

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 mt-[5%]">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Investigación y Desarrollo</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Descubre nuestros proyectos innovadores y estudios en curso que están transformando el futuro de la medicina y la biotecnología.
        </p>
      </header>

      <section className="mb-16">
        <h2 className="text-2xl font-bold text-gray-800 mb-8 border-l-4 border-blue-600 pl-4">
          Proyectos de Investigación
        </h2>
        <div className="grid gap-6">
          {projects.map((project) => (
            <ResearchCard key={project.id} item={project} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-8 border-l-4 border-green-600 pl-4">
          Estudios Clínicos
        </h2>
        <div className="grid gap-6">
          {investigations.map((investigation) => (
            <ResearchCard key={investigation.id} item={investigation} />
          ))}
        </div>
      </section>
    </main>
  );
}