'use client'

import Link from 'next/link';
import { HiExclamation } from 'react-icons/hi';
import { useSiteConfig, getSystemMessages, getThemeColors } from '@/hooks/useSiteConfig';

export default function NotFound() {
  const { siteConfig, isLoading } = useSiteConfig();
  
  // Obtener mensajes dinámicos con fallbacks
  const messages = getSystemMessages(siteConfig);
  const colors = getThemeColors(siteConfig);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <HiExclamation className="w-16 h-16 text-red-500 mb-4 mx-auto" />
        <h2 className="text-4xl font-bold text-gray-800 mb-2">{messages.notFoundTitle}</h2>
        <p className="text-gray-600 mb-6">{messages.notFoundMessage}</p>
        <Link 
          href="/" 
          className="font-semibold py-3 px-6 rounded-md transition duration-300 text-white"
          style={{
            backgroundColor: colors.primary,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = colors.secondary;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = colors.primary;
          }}
        >
          {messages.notFoundButton}
        </Link>
      </div>
    </div>
  );
}