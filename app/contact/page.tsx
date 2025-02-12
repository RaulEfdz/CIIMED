import { Map, PhoneIcon } from "lucide-react";
import { BiEnvelopeOpen } from "react-icons/bi";
const mapubic = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.9933733942776!2d-79.53632542397723!3d8.97275568986472!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8faca8c1954bfe75%3A0x2874244d550d2e58!2sHospital%20Nacional!5e0!3m2!1ses!2spa!4v1739394007363!5m2!1ses!2spa"
export default function ContactPage() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-8 mt-[5%]">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Contacto</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Ponte en contacto con nuestro equipo de expertos. Estamos aquí para responder a tus preguntas y colaborar contigo.
        </p>
      </header>

      <section className="mb-16">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Información de contacto */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-8 border-l-4 border-blue-600 pl-4">
              Información de contacto
            </h2>
            
            <div className="flex flex-col gap-6">
              <ContactCard
                icon={<Map className="h-6 w-6 text-blue-600"/>}
                title="Oficina Central"
                content="Calle de la Ciencia 123, Madrid, España"
              />
              
              <ContactCard
                icon={<BiEnvelopeOpen className="h-6 w-6 text-green-600"/>}
                title="Correo Electrónico"
                content="contacto@biotechinnovacion.com"
                link="mailto:contacto@biotechinnovacion.com"
              />
              
              <ContactCard
                icon={<PhoneIcon className="h-6 w-6 text-purple-600"/>}
                title="Teléfono"
                content="+34 912 345 678"
                link="tel:+34912345678"
              />
            </div>
          </div>

          {/* Formulario de contacto */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-2xl font-bold text-gray-800 mb-8 border-l-4 border-green-600 pl-4">
              Formulario de contacto
            </h2>
            
            <form className="space-y-6">
              <div className="grid gap-4">
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mensaje</label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Enviar mensaje
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Mapa */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-gray-800 mb-8 border-l-4 border-purple-600 pl-4">
          Nuestra ubicación
        </h2>
        <div className="rounded-xl overflow-hidden shadow-sm">
          <iframe
            src={mapubic}
            width="100%"
            height="450"
            className="border-0"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </main>
  );
}

interface ContactCardProps {
  icon: React.ReactNode;
  title: string;
  content: string;
  link?: string;
}

const ContactCard = ({ icon, title, content, link }: ContactCardProps) => (
  <article className="flex items-start gap-4 p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
    <div className="p-3 bg-gray-100 rounded-lg">
      {icon}
    </div>
    
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      {link ? (
        <a
          href={link}
          className="text-gray-600 hover:text-blue-600 transition-colors"
        >
          {content}
        </a>
      ) : (
        <p className="text-gray-600">{content}</p>
      )}
    </div>
  </article>
);