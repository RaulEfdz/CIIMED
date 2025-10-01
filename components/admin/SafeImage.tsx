'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ImageOff } from 'lucide-react'

interface SafeImageProps {
  src?: string
  alt: string
  width?: number
  height?: number
  className?: string
  fallbackSrc?: string
  showPlaceholder?: boolean
}

export default function SafeImage({
  src,
  alt,
  width,
  height,
  className = '',
  fallbackSrc,
  showPlaceholder = true
}: SafeImageProps) {
  const [imageError, setImageError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Si no hay src, mostrar placeholder
  if (!src) {
    if (!showPlaceholder) return null
    return (
      <div className={`bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center p-4">
          <ImageOff className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-500">Sin imagen</p>
        </div>
      </div>
    )
  }

  // Detectar si es una URL de UploadThing
  const isUploadThingUrl = src.includes('uploadthing') || src.includes('ufs.sh')

  // Si hay error de imagen y es de UploadThing, usar fallback
  if (imageError && isUploadThingUrl) {
    if (fallbackSrc) {
      return (
        <SafeImage
          src={fallbackSrc}
          alt={alt}
          width={width}
          height={height}
          className={className}
          showPlaceholder={showPlaceholder}
        />
      )
    }
    
    if (!showPlaceholder) return null
    
    return (
      <div className={`bg-yellow-50 border-2 border-yellow-200 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center p-4">
          <ImageOff className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
          <p className="text-sm text-yellow-600">Imagen temporalmente no disponible</p>
          <p className="text-xs text-yellow-500 mt-1">Se mostrará cuando se restablezca la conexión</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
        </div>
      )}
      
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onError={() => setImageError(true)}
        onLoad={() => setIsLoading(false)}
        style={width && height ? { width, height } : undefined}
      />
    </div>
  )
}