import React, { useState, useMemo } from "react";
import { Search, Filter, ArrowUpCircle } from "lucide-react";
import NoveltyCard, { NoveltyCardProps } from "../Cards/NoveltyCard";

interface NoveltiesContainerProps {
  novelties: NoveltyCardProps[];
  search?: boolean;
}

const NoveltiesContainer: React.FC<NoveltiesContainerProps> = ({
  novelties,
  search = false,
}) => {
  const [visibleNovelties, setVisibleNovelties] = useState(6);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Obtener categorías únicas
  const categories = useMemo(() => {
    const uniqueCategories = new Set(
      novelties.map((novelty) => novelty.category).filter(Boolean)
    );
    return ["Todos", ...Array.from(uniqueCategories)];
  }, [novelties]);

  // Filtrar novedades
  const filteredNovelties = useMemo(() => {
    return novelties.filter((novelty) => {
      const matchesSearch =
        novelty.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        novelty.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "Todos" || novelty.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [novelties, searchTerm, selectedCategory]);

  // Ordenar novedades por fecha de publicación
  const sortedNovelties = useMemo(() => {
    return [...filteredNovelties].sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime(); // Orden descendente
    });
  }, [filteredNovelties]);

  const handleShowMore = () => {
    setVisibleNovelties((prev) => prev + 6);
  };

  const handleScroll = () => {
    setShowScrollTop(window.scrollY > 300);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  React.useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="h-auto bg-transparent p-6 pb-10">
      <div className="max-w-7xl mx-auto">
        {/* Cabecera y Filtros */}
        <div className="mb-8 space-y-4">
          <h2 className="text-3xl font-bold text-gray-900">
            Últimas Novedades
          </h2>
          {search && (
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Buscar novedades por título o descripción..."
                  className="w-full pl-10 pr-4 py-2 border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Filtro de categorías */}
              {categories.length > 1 && (
                <div className="flex items-center space-x-2 rounded-none">
                  <Filter className="text-gray-400 h-5 w-5" />
                  <select
                    className="border px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-none"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Grid de novedades */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedNovelties.slice(0, visibleNovelties).map((novelty, index) => (
            <NoveltyCard key={index} {...novelty} />
          ))}
        </div>

        {/* Mensaje si no hay novedades */}
        {sortedNovelties.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">
              No se encontraron novedades que coincidan con tu búsqueda.
            </p>
          </div>
        )}

        {/* Botón Ver más */}
        {visibleNovelties < sortedNovelties.length && (
          <div className="mt-8 text-center">
            <button
              onClick={handleShowMore}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 shadow-md hover:shadow-lg"
            >
              Cargar más novedades
            </button>
          </div>
        )}

        {/* Botón Scroll to Top */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 bg-white p-2 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300"
            aria-label="Volver arriba"
          >
            <ArrowUpCircle className="h-6 w-6 text-blue-600" />
          </button>
        )}
      </div>
    </div>
  );
};

export default NoveltiesContainer;
