'use client'

import { useState, useEffect } from 'react'
import { throttle } from '@/lib/performance'

interface ProgressiveImageProps {
  src: string
  alt: string
  placeholderSrc?: string
  className?: string
  width?: number
  height?: number
  onLoad?: () => void
  priority?: boolean
}

/**
 * A component that implements progressive image loading
 * 1. Shows a low-resolution placeholder
 * 2. Loads the high-resolution image in the background
 * 3. Smoothly transitions between them
 */
export default function ProgressiveImage({
  src,
  alt,
  placeholderSrc,
  className = '',
  width,
  height,
  onLoad,
  priority = false
}: ProgressiveImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [currentSrc, setCurrentSrc] = useState(placeholderSrc || src)
  const [isPlaceholder, setIsPlaceholder] = useState(Boolean(placeholderSrc))
  const [isInViewport, setIsInViewport] = useState(priority)
  
  // Default placeholder if none provided
  const defaultPlaceholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNmMGYwZjAiLz48L3N2Zz4='
  
  // Set up intersection observer to detect when image is in viewport
  useEffect(() => {
    if (typeof window === 'undefined' || priority) return
    
    const observer = new IntersectionObserver(
      throttle((entries) => {
        const [entry] = entries
        setIsInViewport(entry.isIntersecting)
      }, 100),
      { rootMargin: '200px' } // Start loading when within 200px of viewport
    )
    
    const element = document.getElementById(`progressive-img-${src.replace(/\W/g, '')}`)
    if (element) {
      observer.observe(element)
    }
    
    return () => {
      if (element) {
        observer.unobserve(element)
      }
      observer.disconnect()
    }
  }, [src, priority])
  
  // Load high-res image when in viewport
  useEffect(() => {
    if (!isInViewport || !isPlaceholder) return
    
    const highResImage = new Image()
    highResImage.src = src
    
    highResImage.onload = () => {
      setCurrentSrc(src)
      setIsLoaded(true)
      setIsPlaceholder(false)
      if (onLoad) onLoad()
    }
    
    return () => {
      highResImage.onload = null
    }
  }, [src, isInViewport, isPlaceholder, onLoad])
  
  // Set the initial placeholder if needed
  useEffect(() => {
    if (!placeholderSrc && isPlaceholder) {
      setCurrentSrc(defaultPlaceholder)
    }
  }, [placeholderSrc, isPlaceholder, defaultPlaceholder])
  
  return (
    <div 
      className="relative overflow-hidden"
      style={{ width: width ? `${width}px` : '100%', height: height ? `${height}px` : 'auto' }}
    >
      <img
        id={`progressive-img-${src.replace(/\W/g, '')}`}
        src={currentSrc}
        alt={alt}
        className={`
          ${className}
          ${isPlaceholder ? 'blur-sm' : 'blur-0'}
          transition-all duration-500
          w-full h-full object-cover
        `}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
      />
      
      {isPlaceholder && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  )
}