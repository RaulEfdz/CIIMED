import React, { useState, useMemo, useEffect, useCallback } from "react";
import { Search, ArrowUpCircle } from "lucide-react";
import NewsCard, { NewsCardProps } from "../Cards/NewsCard";

interface NewsContainerProps {
  news: NewsCardProps[];
  search?: boolean
}

const NewsContainer: React.FC<NewsContainerProps> = ({ news, search }) => {
  const [visibleNews, setVisibleNews] = useState(6);
  const [searchTerm, setSearchTerm] = useState("");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Debounce para evitar búsqueda en cada pulsación
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Filtrar noticias (ignorando mayúsculas y acentos)
  const filteredNews = useMemo(() => {
    if (!debouncedSearchTerm) return news; // Si no hay búsqueda, mostrar todas las noticias disponibles

    const normalizedSearch = debouncedSearchTerm
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    return news.filter((item) => {
      const normalizedTitle = item.title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      const normalizedDesc = item.description
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

      return normalizedTitle.includes(normalizedSearch) || normalizedDesc.includes(normalizedSearch);
    });
  }, [news, debouncedSearchTerm]);

  // Mostrar noticias limitadas
  const displayedNews = useMemo(() => filteredNews.slice(0, visibleNews), [filteredNews, visibleNews]);

  // Manejar mostrar más noticias
  const handleShowMore = () => {
    setVisibleNews((prev) => prev + 6);
  };

  // Manejar scroll para botón "Volver arriba"
  const handleScroll = useCallback(() => {
    setShowScrollTop(window.scrollY > 300);
  }, []);

  // Volver arriba
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <div className="h-auto bg-transparent p-6 pb-10">
      <div className="max-w-7xl mx-auto">
        {/* Cabecera y Búsqueda */}
        <div className="mb-8 space-y-4">
          <h2 className="text-3xl font-bold text-gray-900">Noticias y Actualizaciones</h2>

          <div className="flex flex-col md:flex-row gap-4">
            {/* Barra de búsqueda */}
            {search && (  <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Buscar noticias..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Buscar noticias"
              />
            </div>)}
          </div>
        </div>

        {/* Grid de noticias */}
        {displayedNews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedNews.map((item, index) => (
              <div key={index} className="opacity-100 transition-opacity duration-300">
                <NewsCard {...item} />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-10">No se encontraron noticias.</p>
        )}

        {/* Botón Ver más */}
        {visibleNews < filteredNews.length && (
          <div className="mt-8 text-center">
            <button
              onClick={handleShowMore}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 shadow-md hover:shadow-lg"
              aria-label="Cargar más noticias"
            >
              Cargar más noticias
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

export default NewsContainer;
