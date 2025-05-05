// @ts-nocheck
import React from 'react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  color?: 'primary' | 'secondary' | 'white'
  fullScreen?: boolean
  message?: string
}

const LoadingSpinner = ({
  size = 'md',
  color = 'primary',
  fullScreen = false,
  message
}: LoadingSpinnerProps) => {
  // Map sizes to classes
  const sizeClasses = {
    sm: 'h-5 w-5 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4'
  }
  
  // Map colors to classes
  const colorClasses = {
    primary: 'border-primary',
    secondary: 'border-secondary',
    white: 'border-white'
  }
  
  // Create the spinner element
  const spinner = (
    <div className={`${sizeClasses[size]} rounded-full animate-spin border-t-transparent ${colorClasses[color]}`} />
  )
  
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center z-50">
        {spinner}
        {message && <p className="mt-4 text-gray-400">{message}</p>}
      </div>
    )
  }
  
  return (
    <div className="flex flex-col items-center justify-center py-4">
      {spinner}
      {message && <p className="mt-2 text-sm text-gray-400">{message}</p>}
    </div>
  )
}

export default LoadingSpinner 