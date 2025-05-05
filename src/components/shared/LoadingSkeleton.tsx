'use client'

import React from 'react'

interface LoadingSkeletonProps {
  className?: string
  width?: string
  height?: string
  rounded?: string
}

const LoadingSkeleton = ({
  className = '',
  width = 'w-full',
  height = 'h-4',
  rounded = 'rounded-md'
}: LoadingSkeletonProps) => {
  return (
    <div 
      className={`animate-pulse bg-gray-800/50 ${width} ${height} ${rounded} ${className}`}
      aria-hidden="true"
    />
  )
}

export default LoadingSkeleton 