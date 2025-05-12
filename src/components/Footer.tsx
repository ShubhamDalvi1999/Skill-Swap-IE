'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

// Company logos data
const companies = [
  { id: 'atlassian', name: 'Atlassian', logo: '/images/companies/atlassian.svg' },
  { id: 'shopify', name: 'Shopify', logo: '/images/companies/shopify.svg' },
  { id: 'slack', name: 'Slack', logo: '/images/companies/slack.svg' },
  { id: 'spotify', name: 'Spotify', logo: '/images/companies/spotify.svg' },
  { id: 'dropbox', name: 'Dropbox', logo: '/images/companies/dropbox.svg' },
  { id: 'twilio', name: 'Twilio', logo: '/images/companies/twilio.svg' },
]

export default function Footer() {
  return (
    <footer className="bg-[#1E1E1E] text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        {/* Top companies banner */}
        <div className="text-center mb-10">
          <p className="text-[#C1C8D2] mb-6">Top companies choose SkillSwap for effective developer training</p>
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6">
            {companies.map((company) => (
              <div key={company.id} className="grayscale opacity-70 hover:opacity-100 transition-opacity">
                <div className="h-9">
                  <div className="text-white font-bold">{company.name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* CTA section */}
        <div className="bg-gradient-to-r from-[#0062A6] to-[#0062A6]/80 rounded-xl p-8 md:p-12 text-center md:text-left md:flex justify-between items-center mb-12">
          <div className="mb-6 md:mb-0 md:mr-6">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">Ready to escape tutorial hell?</h3>
            <p className="text-[#8BE3FF] max-w-xl">
              Stop watching endless videos and start building real skills that will get you hired
            </p>
          </div>
          <div className="flex-shrink-0">
            <Link href="/signup">
              <button
                type="button"
                className="px-6 py-3 bg-[#FFD644] text-[#1E1E1E] hover:bg-[#28D7A0] font-semibold rounded-lg inline-flex items-center"
              >
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            </Link>
          </div>
        </div>
        
        {/* Copyright & legal notices */}
        <div className="text-center text-[#C1C8D2] text-sm">
          <p className="mb-2">© {new Date().getFullYear()} SkillSwap, Inc. All rights reserved.</p>
          <p>
            SkillSwap and the SkillSwap logo are registered trademarks of SkillSwap, Inc. 
            All course names and branding are property of their respective owners.
          </p>
        </div>
      </div>
    </footer>
  )
} 