'use client'

import React from 'react'
import Image from 'next/image'

// Sample partner company data - would come from an API in a real app
const partners = [
  {
    id: 1,
    name: 'Microsoft',
    logo: '/images/partners/microsoft.svg',
  },
  {
    id: 2,
    name: 'Google',
    logo: '/images/partners/google.svg',
  },
  {
    id: 3,
    name: 'Amazon',
    logo: '/images/partners/amazon.svg',
  },
  {
    id: 4,
    name: 'Meta',
    logo: '/images/partners/meta.svg',
  },
  {
    id: 5,
    name: 'Netflix',
    logo: '/images/partners/netflix.svg',
  },
  {
    id: 6,
    name: 'Adobe',
    logo: '/images/partners/adobe.svg',
  },
]

export default function PartnerLogos() {
  return (
    <div className="py-12 bg-white border-t border-[#A9A9A9]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-semibold text-[#0062A6] mb-4">Trusted by Leading Companies</h2>
          <p className="text-[#1E1E1E]">
            Our graduates work at top tech companies worldwide
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center justify-items-center">
          {partners.map((partner) => (
            <div key={partner.id} className="grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all duration-300">
              <div className="w-[120px] h-[60px] relative flex items-center justify-center">
                <div className="bg-[#8BE3FF]/20 rounded-lg p-4 w-full h-full flex items-center justify-center">
                  <div className="text-[#0062A6] font-bold text-lg">{partner.name}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <p className="text-center text-[#C1C8D2] mt-8 max-w-2xl mx-auto">
          Join thousands of developers who have transformed their careers by building real-world skills on SkillSwap
        </p>
      </div>
    </div>
  )
} 