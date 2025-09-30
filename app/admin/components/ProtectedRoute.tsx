'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/admin/verify')
      if (response.ok) {
        setIsAuthenticated(true)
      } else {
        setIsAuthenticated(false)
        router.push('/admin/login')
      }
    } catch (error) {
      setIsAuthenticated(false)
      router.push('/admin/login')
    }
  }

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Verificando acceso...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Se redirige automáticamente
  }

  return <>{children}</>
}