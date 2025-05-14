'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

type LogoProps = {
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
  className?: string
}

const sizes = {
  sm: 24,
  md: 32,
  lg: 48
}

export default function Logo({ size = 'md', showText = true, className = '' }: LogoProps) {
  const logoSize = sizes[size]
  
  return (
    <div className={`flex items-center ${className}`}>
      <div className="relative" style={{ width: logoSize, height: logoSize }}>
        <Image 
          src="/images/logo.png"
          alt="SkillSwap Logo"
          width={logoSize}
          height={logoSize}
          className="object-contain"
          priority
        />
      </div>
      
      {showText && (
        <span className="text-primary-500 font-bold text-2xl ml-2">SkillSwap</span>
      )}
    </div>
  )
} 