'use client'

import { useState, useEffect } from 'react'

export interface News {
  id: string
  title: string
  description: string
  content?: string
  imageUrl?: string
  imageAlt?: string
  imgW?: number
  imgH?: number
  link?: string
  author: string
  readTime: string
  slug: string
  featured: boolean
  published: boolean
  tags: string[]
  metaTitle?: string
  metaDescription?: string
  publishedAt: string
  createdAt: string
  updatedAt: string
}

interface UseNewsOptions {
  includeUnpublished?: boolean
  featured?: boolean
  limit?: number
  search?: string
}

interface UseNewsReturn {
  news: News[]
  isLoading: boolean
  error: string | null
  refetch: () => void
}

export function useNews(options: UseNewsOptions = {}): UseNewsReturn {
  const [news, setNews] = useState<News[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchNews = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Construir query parameters
      const params = new URLSearchParams()
      if (options.includeUnpublished) params.append('includeUnpublished', 'true')
      if (options.featured) params.append('featured', 'true')
      if (options.limit) params.append('limit', options.limit.toString())
      if (options.search) params.append('search', options.search)

      const response = await fetch(`/api/news?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      
      if (data.success) {
        setNews(data.news)
      } else {
        throw new Error(data.error || 'Error al cargar noticias')
      }
    } catch (err) {
      console.error('Error fetching news:', err)
      setError(err instanceof Error ? err.message : 'Error desconocido')
      setNews([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchNews()
  }, [
    options.includeUnpublished,
    options.featured,
    options.limit,
    options.search
  ])

  return {
    news,
    isLoading,
    error,
    refetch: fetchNews
  }
}

// Hook específico para noticias destacadas
export function useFeaturedNews(limit?: number): UseNewsReturn {
  return useNews({ featured: true, limit })
}

// Hook específico para noticias publicadas
export function usePublishedNews(limit?: number): UseNewsReturn {
  return useNews({ limit })
}