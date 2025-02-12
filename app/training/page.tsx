import { BookOpen, ClockIcon } from "lucide-react";
import { FaUserGroup } from "react-icons/fa6";
import { GiVideoCamera } from "react-icons/gi";
import { HiAcademicCap } from "react-icons/hi";

export default function TrainingPage() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-8 mt-[5%]">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Formación y Capacitación</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Programa de formación continua para profesionales de la salud e investigadores. Mejora tus habilidades con nuestros cursos certificados.
        </p>
      </header>

      {/* Filtros */}
      <section className="mb-8">
        <div className="flex flex-wrap gap-3">
          <button className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200 transition-colors">
            Todos
          </button>
          <button className="px-4 py-2 bg-green-100 text-green-800 rounded-full hover:bg-green-200 transition-colors">
            Técnico
          </button>
          <button className="px-4 py-2 bg-purple-100 text-purple-800 rounded-full hover:bg-purple-200 transition-colors">
            Gestión
          </button>
          <button className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full hover:bg-yellow-200 transition-colors">
            Clínico
          </button>
        </div>
      </section>

      {/* Listado de Cursos */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-gray-800 mb-8 border-l-4 border-blue-600 pl-4">
          Próximos Cursos
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <CourseCard
            icon={<HiAcademicCap className="h-8 w-8 text-blue-600" />}
            title="Biotecnología Aplicada a la Medicina"
            description="Curso intensivo sobre aplicaciones clínicas de terapias génicas y celulares"
            duration="40 horas"
            modality="Online"
            category="Técnico"
          />
          
          <CourseCard
            icon={<BookOpen className="h-8 w-8 text-green-600" />}
            title="Gestión de Proyectos de Investigación"
            description="Metodologías ágiles para la gestión eficiente de proyectos científicos"
            duration="30 horas"
            modality="Presencial"
            category="Gestión"
          />
          
          <CourseCard
            icon={<FaUserGroup className="h-8 w-8 text-purple-600" />}
            title="Ética en Investigación Clínica"
            description="Normativas internacionales y buenas prácticas clínicas"
            duration="20 horas"
            modality="Híbrido"
            category="Clínico"
          />
        </div>
      </section>

      {/* Programa Destacado */}
      <section className="mb-16 bg-blue-50 rounded-xl p-8">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="flex-shrink-0">
            <GiVideoCamera className="h-24 w-24 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Programa de Especialización en Terapias Avanzadas
            </h2>
            <p className="text-gray-600 mb-4">
              Formación integral de 6 meses con expertos internacionales. Incluye prácticas en laboratorios certificados.
            </p>
            <div className="flex gap-4 items-center">
              <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm">Inscripciones abiertas</span>
              <span className="text-gray-500 text-sm"><ClockIcon className="h-4 w-4 inline mr-1" />Duración: 6 meses</span>
            </div>
          </div>
        </div>
      </section>

      {/* Formulario de Registro */}
      <section className="mb-16">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 border-l-4 border-green-600 pl-4">
            Registro de Interés
          </h2>
          
          <form className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre completo</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Correo electrónico</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Curso de interés</label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option>Seleccionar curso...</option>
                  <option>Biotecnología Aplicada a la Medicina</option>
                  <option>Gestión de Proyectos de Investigación</option>
                  <option>Ética en Investigación Clínica</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Modalidad preferida</label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option>Cualquiera</option>
                  <option>Online</option>
                  <option>Presencial</option>
                  <option>Híbrido</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Enviar solicitud
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

interface CourseCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  duration: string;
  modality: string;
  category: string;
}

const CourseCard = ({ icon, title, description, duration, modality, category }: CourseCardProps) => (
  <article className="flex flex-col p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-start gap-4 mb-4">
      <div className="p-3 bg-gray-100 rounded-lg">
        {icon}
      </div>
      <div>
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
        <div className="flex gap-2 mt-2">
          <span className="text-sm text-gray-500"><ClockIcon className="h-4 w-4 inline mr-1" />{duration}</span>
          <span className="text-sm text-gray-500">•</span>
          <span className="text-sm text-gray-500">{modality}</span>
        </div>
      </div>
    </div>
    <p className="text-gray-600 mb-4">{description}</p>
    <div className="flex justify-between items-center mt-auto">
      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
        {category}
      </span>
      <button className="text-blue-600 hover:text-blue-800 font-medium">
        Más información →
      </button>
    </div>
  </article>
);