'use client'

import React from 'react'
import Image from 'next/image'
import { Quote } from 'lucide-react'

// Sample case studies data
const caseStudies = [
  {
    id: 1,
    quote: "SkillSwap's project-based approach helped me build a real portfolio that actually got me hired. After 6 months of tutorial videos with nothing to show for it, this was exactly what I needed.",
    name: "Jason Rivera",
    title: "Frontend Developer at Stripe",
    avatar: "/images/testimonials/user1.jpg"
  },
  {
    id: 2,
    quote: "The difference is the community and accountability. I was stuck in tutorial hell for over a year before finding SkillSwap. The structured learning paths and mentor feedback changed everything for me.",
    name: "Michelle Chang",
    title: "Full Stack Developer at Airbnb",
    avatar: "/images/testimonials/user2.jpg"
  },
  {
    id: 3,
    quote: "Our team uses SkillSwap to onboard new developers and help them quickly become productive. The practical approach means they're building real skills, not just watching videos.",
    name: "Thomas Wright",
    title: "Engineering Manager at Shopify",
    avatar: "/images/testimonials/user3.jpg"
  }
]

// Stats data
const stats = [
  { id: 1, value: '93%', label: 'of members complete their learning paths' },
  { id: 2, value: '81%', label: 'report finding a better job within 6 months' },
  { id: 3, value: '4.7x', label: 'faster skill acquisition vs. tutorial-only learning' },
]

export default function CaseStudies() {
  return (
    <div className="py-20 bg-[#8BE3FF]/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#0062A6] mb-4">Success Stories</h2>
          <p className="text-[#1E1E1E] max-w-2xl mx-auto">
            See how other learners escaped tutorial hell and built real-world skills.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {caseStudies.map((study) => (
            <div 
              key={study.id} 
              className="bg-[#0062A6] p-8 rounded-lg border border-[#0062A6]/50 shadow-xl flex flex-col"
            >
              <div className="mb-6 text-[#8BE3FF]">
                <Quote className="h-10 w-10 opacity-40" />
              </div>
              <p className="text-white mb-8 flex-grow text-lg italic">"{study.quote}"</p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-[#0062A6]/70 overflow-hidden mr-4 flex-shrink-0">
                  <div className="w-full h-full flex items-center justify-center text-[#8BE3FF] font-bold">
                    {study.name.charAt(0)}
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-white">{study.name}</h4>
                  <p className="text-[#8BE3FF] text-sm">{study.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Stats section */}
        <div className="bg-[#0062A6] rounded-xl border border-[#0062A6]/70 p-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {stats.map((stat) => (
              <div key={stat.id}>
                <p className="text-4xl md:text-5xl font-bold text-[#FFD644] mb-2">{stat.value}</p>
                <p className="text-[#8BE3FF]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 