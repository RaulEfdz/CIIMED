import React, { useState, useMemo, useEffect, useCallback } from "react";
import { Search, ArrowUpCircle } from "lucide-react";
import NewsCard, { NewsCardProps } from "../Cards/NewsCard";

interface NewsContainerProps {
  news: NewsCardProps[];
  search?: boolean;
}

const NewsContainer: React.FC<NewsContainerProps> = ({ news, search }) => {
  const [visibleNews, setVisibleNews] = useState(6);
  const [searchTerm, setSearchTerm] = useState("");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const filteredNews = useMemo(() => {
    if (!debouncedSearchTerm) return news;

    const normalizedSearch = debouncedSearchTerm
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "");

    return news.filter((item) => {
      const normalizedTitle = item.title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "");
      const normalizedDesc = item.description
        .toLowerCase()
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "");

      return (
        normalizedTitle.includes(normalizedSearch) ||
        normalizedDesc.includes(normalizedSearch)
      );
    });
  }, [news, debouncedSearchTerm]);

  const displayedNews = useMemo(
    () => filteredNews.slice(0, visibleNews),
    [filteredNews, visibleNews]
  );

  const handleShowMore = () => {
    setVisibleNews((prev) => prev + 6);
  };

  const handleScroll = useCallback(() => {
    setShowScrollTop(window.scrollY > 300);
  }, []);

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
        <div className="mb-8 space-y-4">
          <div className="mb-16 text-center">
            <span className="inline-block px-4 py-1 rounded-full text-sm bg-[#285C4D] text-white mb-4">
              Informacion
            </span>
            <h1 className="text-4xl sm:text-5xl mb-4 font-gogh-extrabold">
              Noticias y Actualizaciones
            </h1>
            <div className="w-24 h-1 bg-[#285C4D] mx-auto rounded-full"></div>
          </div>

          {search && (
            <div className="relative flex justify-center">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Buscar noticias..."
                className="w-full max-w-lg pl-10 pr-4 py-2 border rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Buscar noticias"
              />
            </div>
          )}
        </div>

        {displayedNews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 place-items-center">
            {displayedNews.map((item, index) => (
              <div key={index} className="opacity-100 transition-opacity duration-300">
                <NewsCard {...item} />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-10">No se encontraron noticias.</p>
        )}

        {visibleNews < filteredNews.length && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleShowMore}
              className="px-6 py-3 bg-blue-600 text-white rounded-sm hover:bg-blue-700 transition-colors duration-300 shadow-md hover:shadow-lg"
              aria-label="Cargar más noticias"
            >
              Cargar más noticias
            </button>
          </div>
        )}

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
