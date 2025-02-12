import { BriefcaseIcon, HandHeartIcon, HeartIcon } from "lucide-react";
import { HiAcademicCap } from "react-icons/hi";

export default function PartnershipsPage() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-8 mt-[5%]">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Alianzas Estratégicas</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Colaboramos con organizaciones innovadoras para impulsar avances científicos y tecnológicos que transformen el futuro de la salud.
        </p>
      </header>

      {/* Sección de Oportunidades */}
      <section className="mb-16">
        <div className="bg-blue-50 rounded-xl p-8 mb-12 text-center">
          <h2 className="text-2xl font-semibold text-blue-800 mb-4">
            ¿Interesado en colaborar con nosotros?
          </h2>
          <p className="text-gray-600 mb-6 max-w-3xl mx-auto">
            Únete a nuestra red de partners y accede a oportunidades exclusivas de I+D, recursos compartidos y proyectos innovadores.
          </p>
          <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
            Solicitar información
          </button>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-8 border-l-4 border-green-600 pl-4">
          Tipos de Colaboración
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <PartnershipCard
            icon={<BriefcaseIcon className="h-8 w-8 text-blue-600" />}
            title="Alianzas Corporativas"
            description="Colaboraciones estratégicas con empresas para desarrollo conjunto de tecnologías y transferencia de conocimiento."
            category="Industria"
          />
          
          <PartnershipCard
            icon={<HiAcademicCap className="h-8 w-8 text-purple-600" />}
            title="Academia e Investigación"
            description="Cooperación con instituciones académicas para investigación básica y formación de talento especializado."
            category="Academia"
          />
          
          <PartnershipCard
            icon={<HeartIcon className="h-8 w-8 text-red-600" />}
            title="Organizaciones de Salud"
            description="Alianzas con hospitales y clínicas para estudios clínicos e implementación de nuevas terapias."
            category="Salud"
          />
          
          <PartnershipCard
            icon={<HandHeartIcon className="h-8 w-8 text-green-600" />}
            title="Organizaciones sin Fines de Lucro"
            description="Colaboraciones con ONGs y fundaciones para proyectos de impacto social y acceso a tratamientos."
            category="Impacto Social"
          />
        </div>
      </section>

      {/* Beneficios */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-gray-800 mb-8 border-l-4 border-purple-600 pl-4">
          Beneficios para Partners
        </h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <BenefitItem
            title="Acceso Exclusivo"
            description="Prioridad en nuevos desarrollos y tecnologías emergentes"
          />
          <BenefitItem
            title="Recursos Compartidos"
            description="Uso de instalaciones especializadas y equipamiento de última generación"
          />
          <BenefitItem
            title="Visibilidad Global"
            description="Presencia conjunta en publicaciones científicas y eventos internacionales"
          />
        </div>
      </section>

      {/* Formulario de Contacto */}
      <section className="mb-16">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 border-l-4 border-blue-600 pl-4">
            Solicitud de Alianza
          </h2>
          
          <form className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre de la organización</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de colaboración</label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option>Seleccionar...</option>
                  <option>Alianzas Corporativas</option>
                  <option>Academia e Investigación</option>
                  <option>Organizaciones de Salud</option>
                  <option>Impacto Social</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">País</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Propuesta de colaboración</label>
              <textarea
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
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

interface PartnershipCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  category: string;
}

const PartnershipCard = ({ icon, title, description, category }: PartnershipCardProps) => (
  <article className="flex flex-col p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
    <div className="mb-4 flex items-center gap-4">
      <div className="p-3 bg-gray-100 rounded-lg">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
    </div>
    <p className="text-gray-600 mb-4">{description}</p>
    <span className="mt-auto inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
      {category}
    </span>
  </article>
);

interface BenefitItemProps {
  title: string;
  description: string;
}

const BenefitItem = ({ title, description }: BenefitItemProps) => (
  <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
    <div className="w-12 h-12 bg-blue-100 rounded-lg mb-4 flex items-center justify-center">
      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);