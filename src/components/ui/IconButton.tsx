'use client'

import React from 'react'
import Icon from './Icon'
import { IconKey, getIconName } from '@/lib/icons'

interface IconButtonProps {
  icon: IconKey
  onClick?: () => void
  size?: number
  color?: string
  className?: string
  ariaLabel?: string
  variant?: 'default' | 'outline' | 'ghost' | 'primary'
  disabled?: boolean
}

const IconButton = ({
  icon,
  onClick,
  size = 20,
  color,
  className = '',
  ariaLabel,
  variant = 'default',
  disabled = false,
}: IconButtonProps) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md p-2 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:opacity-50'
  
  const variantClasses = {
    default: 'bg-secondary hover:bg-secondary/80 text-white',
    outline: 'border border-gray-700 hover:bg-secondary/80 text-gray-300',
    ghost: 'hover:bg-secondary/80 text-gray-300',
    primary: 'bg-primary hover:bg-primary/90 text-white',
  }
  
  const allClasses = `${baseClasses} ${variantClasses[variant]} ${className}`
  
  return (
    <button
      type="button"
      className={allClasses}
      onClick={onClick}
      aria-label={ariaLabel || `${icon} button`}
      disabled={disabled}
    >
      <Icon
        name={getIconName(icon)}
        size={size}
        color={color}
      />
    </button>
  )
}

export default IconButton 