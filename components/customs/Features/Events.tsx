import React, { useState, useMemo } from 'react';
import { Search, Filter } from 'lucide-react';
import EventCard, { EventCardProps } from '../Cards/EventCard';
import { TopScroll } from '../TopScroll';

interface EventsContainerProps {
  events: EventCardProps[];
  search? : boolean
}

const EventsContainer: React.FC<EventsContainerProps> = ({ events, search }) => {
  const [visibleEvents, setVisibleEvents] = useState(6);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Obtener categorías únicas
  const categories = useMemo(() => {
    const uniqueCategories = new Set(events.map(event => event.category).filter(Boolean));
    return ['Todos', ...Array.from(uniqueCategories)];
  }, [events]);

  // Filtrar eventos
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesSearch = 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = 
        selectedCategory === 'Todos' || event.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [events, searchTerm, selectedCategory]);

  // Ordenar eventos por fecha
  const sortedEvents = useMemo(() => {
    return [...filteredEvents].sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
  }, [filteredEvents]);

  const handleShowMore = () => {
    setVisibleEvents((prev) => prev + 6);
  };

  const handleScroll = () => {
    setShowScrollTop(window.scrollY > 300);
  };

 
  React.useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="h-auto bg-transparent p-6 pb-10">

      <div className="max-w-7xl mx-auto">
        {/* Cabecera y Filtros */}
        <div className="mb-8 space-y-4">
          <h2 className="text-3xl font-bold text-gray-900">Próximos Eventos</h2>
          
          {search && (  <div className="flex flex-col md:flex-row gap-4">
            {/* Barra de búsqueda */}
          <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Buscar eventos por título, descripción o ubicación..."
                className="w-full pl-10 pr-4 py-2 border  focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filtro de categorías */}
            {categories.length > 1 && (
              <div className="flex items-center space-x-2 rounded-none">
                <Filter className="text-gray-400 h-5 w-5" />
                <select
                  className="border  px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-none"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
          )}
        </div>

        {/* Grid de eventos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedEvents.slice(0, visibleEvents).map((event, index) => (
            <EventCard key={index} {...event} />
          ))}
        </div>

        {/* Mensaje si no hay eventos */}
        {sortedEvents.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">No se encontraron eventos que coincidan con tu búsqueda.</p>
          </div>
        )}

        {/* Botón Ver más */}
        {visibleEvents < sortedEvents.length && (
          <div className="mt-8 text-center">
            <button
              onClick={handleShowMore}
              className="px-6 py-3 bg-blue-600 text-white rounded-sm hover:bg-blue-700 transition-colors duration-300 shadow-md hover:shadow-lg"
            >
              Cargar más eventos
            </button>
          </div>
        )}

        {/* Botón Scroll to Top */}
        {showScrollTop && (
                <TopScroll />
        )}
      </div>
    </div>
  );
};

export default EventsContainer;