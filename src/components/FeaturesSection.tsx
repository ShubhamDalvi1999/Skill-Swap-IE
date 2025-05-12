'use client'

import React, { useState } from 'react'
import { 
  BookOpen, 
  Code, 
  Users, 
  Target, 
  LayoutDashboard, 
  Rocket 
} from 'lucide-react'
import Image from 'next/image'

// Features data
const features = [
  {
    id: 'personalized',
    title: 'Personalized Learning Paths',
    description: 'Stop following generic tutorials and create a custom learning journey that builds your real-world skills progressively.',
    icon: LayoutDashboard,
    image: '/images/features/personalized-path.webp',
  },
  {
    id: 'practical',
    title: 'Project-Based Learning',
    description: 'Complete real-world projects that build your portfolio, not just tutorials that lead nowhere.',
    icon: Code,
    image: '/images/features/project-based.webp',
  },
  {
    id: 'community',
    title: 'Supportive Community',
    description: 'Learn alongside others, receive feedback on your code, and build your network with fellow learners.',
    icon: Users,
    image: '/images/features/community.webp',
  },
  {
    id: 'goals',
    title: 'Skill Tracking & Goals',
    description: 'Set measurable goals and track your progress with our skill progress dashboard.',
    icon: Target,
    image: '/images/features/skill-tracking.webp',
  },
  {
    id: 'mentoring',
    title: 'Expert Mentoring',
    description: 'Get guidance from industry professionals who can help you overcome obstacles and accelerate your learning.',
    icon: BookOpen,
    image: '/images/features/mentoring.webp',
  },
  {
    id: 'career',
    title: 'Career-Focused Paths',
    description: "Learn skills that employers actually want, not just what's trending in tutorial videos.",
    icon: Rocket,
    image: '/images/features/career-paths.webp',
  },
]

export default function FeaturesSection() {
  const [activeFeature, setActiveFeature] = useState(features[0].id)
  
  const activeFeatureData = features.find(feature => feature.id === activeFeature) || features[0]

  return (
    <div className="py-20 bg-transparent overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#0062A6] mb-6">How SkillSwap Helps You Escape Tutorial Hell</h2>
          <p className="text-[#1E1E1E] max-w-3xl mx-auto text-xl">
            Transform your learning from passive tutorials to active skill-building with our unique approach.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Features tabs/buttons on the left */}
          <div className="lg:col-span-5">
            <div className="space-y-6">
              {features.map((feature) => (
                <button
                  key={feature.id}
                  type="button"
                  onClick={() => setActiveFeature(feature.id)}
                  className={`w-full text-left p-6 rounded-lg transition-all duration-300 flex items-start gap-4 ${
                    activeFeature === feature.id 
                      ? 'bg-[#8BE3FF]/30 border border-[#0062A6]' 
                      : 'bg-white hover:bg-[#8BE3FF]/10 border border-[#A9A9A9]'
                  }`}
                >
                  <div className={`p-3 rounded-lg ${
                    activeFeature === feature.id ? 'bg-[#0062A6] text-white' : 'bg-[#C1C8D2] text-[#1E1E1E]'
                  }`}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className={`font-bold text-lg mb-1 ${
                      activeFeature === feature.id ? 'text-[#0062A6]' : 'text-[#1E1E1E]'
                    }`}>
                      {feature.title}
                    </h3>
                    <p className="text-[#1E1E1E] text-sm">{feature.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
          
          {/* Feature illustration on the right */}
          <div className="lg:col-span-7 relative">
            <div className="bg-[#8BE3FF]/20 border border-[#A9A9A9] rounded-lg p-6 aspect-video flex items-center justify-center">
              <div className="text-center">
                <div className="bg-[#0062A6]/10 p-6 rounded-xl inline-block mb-6">
                  <activeFeatureData.icon className="h-16 w-16 text-[#0062A6]" />
                </div>
                <h3 className="text-2xl font-bold text-[#0062A6] mb-4">{activeFeatureData.title}</h3>
                <p className="text-[#1E1E1E] max-w-lg mx-auto">
                  {activeFeatureData.description}
                </p>
                <div className="mt-8">
                  <button
                    type="button"
                    className="px-6 py-3 bg-[#FFD644] hover:bg-[#28D7A0] text-[#1E1E1E] rounded-md font-semibold"
                  >
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 