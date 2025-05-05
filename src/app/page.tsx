'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Navbar from '@/components/layout/Navbar'
import { SplineSceneBasic } from '@/components/ui/spline-demo'

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-400 via-cyan-600 to-blue-900 relative overflow-hidden">
      {/* Navbar */}
      <Navbar />
      
      {/* Pixel art clouds and mountains */}
      <div className="absolute inset-0 z-0 bg-[url('/images/pixel-bg.jpg')] bg-cover bg-center opacity-50 pixel-bg"></div>
      
      {/* Content */}
      <div className="container mx-auto px-4 py-16 flex-1 flex flex-col items-center justify-center relative z-10 mt-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl text-white font-vt323 mb-2 tracking-wide">START YOUR</h1>
          <div className="text-6xl md:text-8xl lg:text-9xl font-vt323 font-bold text-yellow-300 drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] mb-6 tracking-wide leading-tight">
            <div>Skill</div>
            <div>Adventure</div>
          </div>
          
          <p className="text-white text-xl md:text-2xl mb-12 max-w-2xl mx-auto">
            The most fun and beginner-friendly way to learn new skills. ⚔️✨
          </p>
          
          <Link href="/dashboard">
            <div className="pixel-button bg-yellow-300 rounded-md px-8 py-3 text-xl font-bold text-black">
              Get Started
            </div>
          </Link>
        </div>
      </div>
      
      {/* 3D Spline Demo Section */}
      <div className="container mx-auto px-4 py-16 relative z-10">
        <h2 className="text-3xl md:text-4xl text-white font-vt323 mb-10 tracking-wide text-center">EXPLORE NEW DIMENSIONS</h2>
        <SplineSceneBasic />
      </div>
      
      {/* Footer with sponsors */}
      <div className="bg-black/30 backdrop-blur-sm py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center">
            <p className="text-gray-300 text-sm mb-4">SUPPORTED BY</p>
            <div className="flex flex-wrap justify-center items-center gap-8">
              <img src="/images/github-logo.svg" alt="GitHub" width={100} height={40} className="opacity-80" />
              <img src="/images/csta-logo.svg" alt="CSTA" width={100} height={40} className="opacity-80" />
              <img src="/images/nys-logo.svg" alt="New York State" width={100} height={40} className="opacity-80" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 