'use client'

import React, { useState, useEffect } from 'react'
import { AlertCircle } from 'lucide-react'
import { IconName } from '@/lib/icons'

interface IconProps {
  name: IconName
  className?: string
  size?: number
  fallback?: React.ReactNode
  onClick?: () => void
}

/**
 * Icon component that can render SVG icons from the public/icons directory
 * or fall back to Lucide icons if the SVG is not found
 */
export default function Icon({ name, className = '', size = 24, fallback, onClick }: IconProps) {
  const [iconSvg, setIconSvg] = useState<string | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    const loadIcon = async () => {
      try {
        // Reset state when name changes
        setError(false)
        setIconSvg(null)
        
        // Try to load the SVG as a file
        const response = await fetch(`/icons/${name}.svg`)
        
        if (!response.ok) {
          throw new Error(`Failed to load icon: ${name}`)
        }
        
        const svg = await response.text()
        setIconSvg(svg)
      } catch (e) {
        console.warn(`Icon not found: ${name}, using fallback`)
        setError(true)
      }
    }

    loadIcon()
  }, [name])

  // Handle loading state
  if (!iconSvg && !error) {
    return <div className={`w-${size} h-${size} animate-pulse bg-gray-200 rounded-full ${className}`} />
  }
  
  // Handle error state with fallback
  if (error) {
    if (fallback) {
      return <>{fallback}</>
    }
    return <AlertCircle className={className} size={size} onClick={onClick} />
  }

  // Render SVG with correct dimensions and class
  return (
    <span 
      className={className}
      dangerouslySetInnerHTML={{ 
        __html: iconSvg!
          .replace(/width="(\d+)"/, `width="${size}"`)
          .replace(/height="(\d+)"/, `height="${size}"`)
          .replace(/<svg/, `<svg class="${className}" ${onClick ? 'style="cursor:pointer"' : ''}`)
      }}
      onClick={onClick}
    />
  )
} 