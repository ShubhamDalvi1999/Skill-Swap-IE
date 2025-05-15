// @ts-nocheck
'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Navbar from '@/components/layout/Navbar'
import CourseCarousel from '@/components/CourseCarousel'
import PartnerLogos from '@/components/PartnerLogos'
import FeaturesSection from '@/components/FeaturesSection'
import TrendingTopics from '@/components/TrendingTopics'
import CaseStudies from '@/components/CaseStudies'
import PricingPlans from '@/components/PricingPlans'
import SEOLinks from '@/components/SEOLinks'
import Footer from '@/components/Footer'

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Top Hero Section with background */}
      <div className="relative">
        {/* Pixel art clouds and mountains background - only for hero section */}
        <div className="absolute inset-0 z-0 flex justify-center items-start">
          <div className="container mx-auto px-4 h-full flex justify-center">
            <img 
              src="/images/pixel-bg.png" 
              alt="Pixel background" 
              className="w-full h-full object-cover object-top pixel-bg"
            />
          </div>
        </div>
        
        {/* Navbar */}
        <Navbar />
        
        {/* Hero Content */}
        <div className="container mx-auto px-4 py-16 flex-1 flex flex-col items-center justify-center relative z-10 mt-16">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl text-white font-vt323 mb-2 tracking-wide">START YOUR</h1>
            <div className="text-6xl md:text-8xl lg:text-9xl font-roboto font-bold text-yellow-300 drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] mb-6 tracking-wide leading-tight">
              <div>Skill</div>
              <div>Adventure</div>
            </div>
            
            <p className="text-white text-2xl md:text-3xl mb-12 max-w-2xl mx-auto">
              The most fun and beginner-friendly way to learn new skills. ✨
            </p>
            
            <Link href="/dashboard">
              <div className="pixel-button bg-yellow-300 rounded-md px-8 py-3 text-xl font-bold text-black">
                Get Started
              </div>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Rest of the page with normal background */}
      <div className="bg-gradient-to-b from-[#8BE3FF] to-white text-[#1E1E1E]">
        <CourseCarousel />
        <PartnerLogos />
        <FeaturesSection />
        <TrendingTopics />
        <CaseStudies />
        <PricingPlans />
        <SEOLinks />
        <Footer />
      </div>
    </div>
  )
} 