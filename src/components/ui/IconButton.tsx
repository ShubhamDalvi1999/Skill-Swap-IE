// @ts-nocheck
'use client'

import type { IconKey } from '@/lib/icons'
import { getIconName } from '@/lib/icons'
import Icon from './Icon'

interface IconButtonProps {
  icon: IconKey
  onClick?: () => void
  size?: number
  className?: string
  ariaLabel?: string
  variant?: 'default' | 'outline' | 'ghost' | 'primary'
  disabled?: boolean
}

const IconButton = ({
  icon,
  onClick,
  size = 20,
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
        className={variant === 'primary' ? 'text-white' : ''}
      />
    </button>
  )
}

export default IconButton 