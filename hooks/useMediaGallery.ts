import { useState, useEffect, useCallback } from 'react';

export type MediaType = 'IMAGE' | 'VIDEO' | 'DOCUMENT' | 'AUDIO';
export type MediaQuality = 'LOW' | 'MEDIUM' | 'HIGH' | 'ORIGINAL';

export interface MediaGalleryItem {
  id: string;
  
  // Información básica
  title: string;
  slug: string;
  description: string;
  alt?: string;
  
  // Tipo y categorización
  type: MediaType;
  category?: string;
  subcategory?: string;
  tags: string[];
  
  // URLs y archivos
  fileUrl: string;
  thumbnailUrl?: string;
  previewUrl?: string;
  
  // Metadatos del archivo
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  duration?: number;
  
  // Dimensiones
  width?: number;
  height?: number;
  aspectRatio?: string;
  
  // Información de contexto
  author?: string;
  source?: string;
  copyright?: string;
  license?: string;
  
  // Ubicación y fecha
  location?: string;
  capturedAt?: string;
  eventDate?: string;
  
  // Configuración y estado
  featured: boolean;
  published: boolean;
  allowDownload: boolean;
  quality: MediaQuality;
  
  // Organización
  collection?: string;
  albumId?: string;
  order: number;
  priority: number;
  
  // Enlaces
  relatedLink?: string;
  externalUrl?: string;
  
  // SEO
  metaTitle?: string;
  metaDescription?: string;
  keywords: string[];
  
  // Configuración de visualización
  showInGallery: boolean;
  showInSlideshow: boolean;
  allowComments: boolean;
  
  // Estadísticas
  views: number;
  downloads: number;
  
  // Fechas
  createdAt: string;
  updatedAt: string;
}

export interface MediaGalleryFilters {
  search?: string;
  type?: MediaType | '';
  category?: string;
  subcategory?: string;
  collection?: string;
  featured?: boolean | null;
  published?: boolean | null;
  quality?: MediaQuality | '';
}

export interface MediaGalleryStats {
  byType: Record<string, number>;
  total: number;
}

export interface MediaGalleryPagination {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
}

export interface MediaGalleryResponse {
  success: boolean;
  mediaItems: MediaGalleryItem[];
  pagination: MediaGalleryPagination;
  stats: MediaGalleryStats;
  filters: MediaGalleryFilters;
  meta: {
    availableCategories: string[];
    availableCollections: string[];
  };
  error?: string;
}

export const useMediaGallery = () => {
  const [mediaItems, setMediaItems] = useState<MediaGalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<MediaGalleryPagination | null>(null);
  const [stats, setStats] = useState<MediaGalleryStats | null>(null);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [availableCollections, setAvailableCollections] = useState<string[]>([]);

  const fetchMediaGallery = useCallback(async (params: {
    page?: number;
    limit?: number;
    search?: string;
    type?: MediaType | '';
    category?: string;
    subcategory?: string;
    collection?: string;
    featured?: boolean | null;
    published?: boolean | null;
    quality?: MediaQuality | '';
  } = {}, retryCount = 0) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Construir query parameters
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.search) queryParams.append('search', params.search);
      if (params.type) queryParams.append('type', params.type);
      if (params.category) queryParams.append('category', params.category);
      if (params.subcategory) queryParams.append('subcategory', params.subcategory);
      if (params.collection) queryParams.append('collection', params.collection);
      if (params.featured !== null && params.featured !== undefined) {
        queryParams.append('featured', params.featured.toString());
      }
      if (params.published !== null && params.published !== undefined) {
        queryParams.append('published', params.published.toString());
      }
      if (params.quality) queryParams.append('quality', params.quality);
      
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
      const url = `${baseUrl}/api/media-gallery?${queryParams.toString()}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // CRÍTICO: Manejo de errores 500 con retry (aprendido de errores anteriores)
      if (!response.ok) {
        if (response.status === 500 && retryCount === 0) {
          console.warn('API returned 500, retrying once...');
          await new Promise(resolve => setTimeout(resolve, 1000));
          return fetchMediaGallery(params, 1);
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: MediaGalleryResponse = await response.json();
      
      if (data.success) {
        setMediaItems(data.mediaItems);
        setPagination(data.pagination);
        setStats(data.stats);
        setAvailableCategories(data.meta.availableCategories);
        setAvailableCollections(data.meta.availableCollections);
      } else {
        throw new Error(data.error || 'Error al obtener elementos de la galería');
      }
    } catch (err) {
      console.error('Error fetching media gallery:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
      // En caso de error, mantener arrays vacíos en lugar de datos mock
      setMediaItems([]);
      setPagination(null);
      setStats(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createMediaItem = useCallback(async (mediaData: Partial<MediaGalleryItem>) => {
    try {
      setError(null);
      
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
      const response = await fetch(`${baseUrl}/api/media-gallery`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mediaData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        // Refrescar la lista después de crear
        await fetchMediaGallery();
        return { success: true, message: data.message, mediaItem: data.mediaItem };
      } else {
        throw new Error(data.error || 'Error al crear elemento de galería');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [fetchMediaGallery]);

  const updateMediaItem = useCallback(async (id: string, updates: Partial<MediaGalleryItem>) => {
    try {
      setError(null);
      
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
      const response = await fetch(`${baseUrl}/api/media-gallery`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, ...updates }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        // Actualizar elemento en la lista local
        setMediaItems(prev => 
          prev.map(item => 
            item.id === id ? { ...item, ...data.mediaItem } : item
          )
        );
        return { success: true, message: data.message, mediaItem: data.mediaItem };
      } else {
        throw new Error(data.error || 'Error al actualizar elemento de galería');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  const deleteMediaItem = useCallback(async (id: string) => {
    try {
      setError(null);
      
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
      const response = await fetch(`${baseUrl}/api/media-gallery/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        // Remover elemento de la lista local
        setMediaItems(prev => prev.filter(item => item.id !== id));
        return { success: true, message: data.message };
      } else {
        throw new Error(data.error || 'Error al eliminar elemento de galería');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  const getMediaItem = useCallback(async (id: string) => {
    try {
      setError(null);
      
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
      const response = await fetch(`${baseUrl}/api/media-gallery/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        return { success: true, mediaItem: data.mediaItem };
      } else {
        throw new Error(data.error || 'Error al obtener elemento de galería');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  const trackDownload = useCallback(async (id: string) => {
    try {
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
      const response = await fetch(`${baseUrl}/api/media-gallery/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'download' }),
      });

      if (response.ok) {
        const data = await response.json();
        // Actualizar contador local
        setMediaItems(prev => 
          prev.map(item => 
            item.id === id ? { ...item, downloads: data.downloads } : item
          )
        );
      }
    } catch (err) {
      // Fallar silenciosamente para no interrumpir la descarga
      console.warn('Failed to track download:', err);
    }
  }, []);

  useEffect(() => {
    fetchMediaGallery();
  }, [fetchMediaGallery]);

  return {
    mediaItems,
    isLoading,
    error,
    pagination,
    stats,
    availableCategories,
    availableCollections,
    fetchMediaGallery,
    createMediaItem,
    updateMediaItem,
    deleteMediaItem,
    getMediaItem,
    trackDownload,
    refetch: fetchMediaGallery
  };
};

// Funciones helper para filtros y utilidades

export const getMediaTypeLabel = (type: MediaType): string => {
  const labels: Record<MediaType, string> = {
    IMAGE: 'Imagen',
    VIDEO: 'Video',
    DOCUMENT: 'Documento',
    AUDIO: 'Audio'
  };
  return labels[type] || type;
};

export const getQualityLabel = (quality: MediaQuality): string => {
  const labels: Record<MediaQuality, string> = {
    LOW: 'Baja',
    MEDIUM: 'Media',
    HIGH: 'Alta',
    ORIGINAL: 'Original'
  };
  return labels[quality] || quality;
};

export const formatFileSize = (bytes?: number): string => {
  if (!bytes) return 'N/A';
  
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 Bytes';
  
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const size = (bytes / Math.pow(1024, i)).toFixed(1);
  
  return `${size} ${sizes[i]}`;
};

export const formatDuration = (seconds?: number): string => {
  if (!seconds) return 'N/A';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

export const isImageType = (mimeType?: string): boolean => {
  return mimeType?.startsWith('image/') || false;
};

export const isVideoType = (mimeType?: string): boolean => {
  return mimeType?.startsWith('video/') || false;
};

export const isAudioType = (mimeType?: string): boolean => {
  return mimeType?.startsWith('audio/') || false;
};

export const isDocumentType = (mimeType?: string): boolean => {
  const documentTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain'
  ];
  return mimeType ? documentTypes.includes(mimeType) : false;
};