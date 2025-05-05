// @ts-nocheck
'use client'

import { useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { IconName } from '@/lib/icons'

interface IconProps {
  name: IconName
  className?: string
  size?: number
  fallback?: ReactNode
  onClick?: () => void
}

/**
 * Icon component that can render SVG icons from the public/icons directory
 * or fall back to a default icon if the SVG is not found
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
    return <div className={`w-${size} h-${size} animate-pulse bg-gray-200 rounded-full ${className}`} aria-hidden="true" />
  }
  
  // Handle error state with fallback
  if (error) {
    if (fallback) {
      return <>{fallback}</>
    }
    // Use a generic fallback icon instead of AlertCircle
    return (
      <div 
        className={`${className} inline-flex items-center justify-center`} 
        style={{ width: `${size}px`, height: `${size}px` }}
        onClick={onClick}
        onKeyDown={onClick ? (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            onClick()
          }
        } : undefined}
        role={onClick ? "button" : undefined}
        tabIndex={onClick ? 0 : undefined}
        aria-label={`Icon ${name}`}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width={size} 
          height={size} 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
    )
  }

  // Create safe HTML for SVG
  let safeHtml = ''
  if (iconSvg) {
    safeHtml = iconSvg
      .replace(/width="(\d+)"/, `width="${size}"`)
      .replace(/height="(\d+)"/, `height="${size}"`)
      .replace(/<svg/, `<svg class="${className}" ${onClick ? 'style="cursor:pointer"' : ''}`)
  }

  // Render SVG with correct dimensions and class
  return (
    <span 
      className={className}
      dangerouslySetInnerHTML={{ __html: safeHtml }}
      onClick={onClick}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick()
        }
      } : undefined}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={`Icon ${name}`}
    />
  )
} 