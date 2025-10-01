'use client'

import { useState, useEffect } from 'react'

export interface Event {
  id: string
  title: string
  description: string
  content?: string
  imageUrl?: string
  imageAlt?: string
  imgW?: number
  imgH?: number
  link?: string
  date: string
  time: string
  location: string
  speaker?: string
  speakers: string[]
  category?: string
  slug: string
  featured: boolean
  published: boolean
  capacity?: number
  price?: number
  currency: string
  tags: string[]
  eventDate: string
  registrationEnd?: string
  createdAt: string
  updatedAt: string
}

interface UseEventsOptions {
  includeUnpublished?: boolean
  featured?: boolean
  limit?: number
  search?: string
  category?: string
  upcoming?: boolean
}

interface UseEventsReturn {
  events: Event[]
  isLoading: boolean
  error: string | null
  refetch: () => void
}

export function useEvents(options: UseEventsOptions = {}): UseEventsReturn {
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchEvents = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Construir query parameters
      const params = new URLSearchParams()
      if (options.includeUnpublished) params.append('includeUnpublished', 'true')
      if (options.featured) params.append('featured', 'true')
      if (options.limit) params.append('limit', options.limit.toString())
      if (options.search) params.append('search', options.search)
      if (options.category) params.append('category', options.category)
      if (options.upcoming) params.append('upcoming', 'true')

      const response = await fetch(`/api/events?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      
      if (data.success) {
        setEvents(data.events)
      } else {
        throw new Error(data.error || 'Error al cargar eventos')
      }
    } catch (err) {
      console.error('Error fetching events:', err)
      setError(err instanceof Error ? err.message : 'Error desconocido')
      setEvents([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [
    options.includeUnpublished,
    options.featured,
    options.limit,
    options.search,
    options.category,
    options.upcoming
  ])

  return {
    events,
    isLoading,
    error,
    refetch: fetchEvents
  }
}

// Hook específico para eventos destacados
export function useFeaturedEvents(limit?: number): UseEventsReturn {
  return useEvents({ featured: true, limit })
}

// Hook específico para eventos próximos
export function useUpcomingEvents(limit?: number): UseEventsReturn {
  return useEvents({ upcoming: true, limit })
}

// Hook específico para eventos por categoría
export function useEventsByCategory(category: string, limit?: number): UseEventsReturn {
  return useEvents({ category, limit })
}