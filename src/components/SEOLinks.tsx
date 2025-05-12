'use client'

import React from 'react'
import Link from 'next/link'

// Footer column links data
const footerLinks = [
  {
    title: 'Explore',
    links: [
      { title: 'Courses', href: '/courses' },
      { title: 'Learning Paths', href: '/paths' },
      { title: 'Topics', href: '/topics' },
      { title: 'Tutorials', href: '/tutorials' },
      { title: 'Projects', href: '/projects' },
      { title: 'Mentorship', href: '/mentorship' },
    ]
  },
  {
    title: 'Community',
    links: [
      { title: 'Forums', href: '/community/forums' },
      { title: 'Discord', href: 'https://discord.gg/skillswap' },
      { title: 'Events', href: '/events' },
      { title: 'Hackathons', href: '/hackathons' },
      { title: 'Blog', href: '/blog' },
      { title: 'Success Stories', href: '/success-stories' },
    ]
  },
  {
    title: 'Resources',
    links: [
      { title: 'Documentation', href: '/docs' },
      { title: 'API References', href: '/api-docs' },
      { title: 'Cheat Sheets', href: '/cheat-sheets' },
      { title: 'Roadmaps', href: '/roadmaps' },
      { title: 'Books', href: '/books' },
      { title: 'Podcast', href: '/podcast' },
    ]
  },
  {
    title: 'Company',
    links: [
      { title: 'About Us', href: '/about' },
      { title: 'Careers', href: '/careers' },
      { title: 'Press', href: '/press' },
      { title: 'Partners', href: '/partners' },
      { title: 'Affiliate Program', href: '/affiliates' },
      { title: 'Contact', href: '/contact' },
    ]
  },
]

// Legal links
const legalLinks = [
  { title: 'Terms of Service', href: '/terms' },
  { title: 'Privacy Policy', href: '/privacy' },
  { title: 'Cookie Policy', href: '/cookies' },
  { title: 'Accessibility', href: '/accessibility' },
  { title: 'Security', href: '/security' },
]

// Language options
const languages = [
  { code: 'en-US', name: 'English (US)' },
  { code: 'es-ES', name: 'Español' },
  { code: 'fr-FR', name: 'Français' },
  { code: 'de-DE', name: 'Deutsch' },
  { code: 'pt-BR', name: 'Português (Brasil)' },
  { code: 'ja-JP', name: '日本語' },
]

export default function SEOLinks() {
  return (
    <div className="py-16 bg-[#8BE3FF]/10 border-t border-[#A9A9A9]">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-[#0062A6] mb-8">Explore Topics</h2>
        
        {/* Main footer links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {footerLinks.map((column, idx) => (
            <div key={idx}>
              <h3 className="text-[#0062A6] font-bold mb-4">{column.title}</h3>
              <ul className="space-y-2">
                {column.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    <Link 
                      href={link.href}
                      className="text-[#1E1E1E] hover:text-[#FF78C4] transition-colors"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Legal links and language selector */}
        <div className="border-t border-[#A9A9A9] pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-wrap gap-4 mb-6 md:mb-0 justify-center md:justify-start">
            {legalLinks.map((link, idx) => (
              <Link 
                key={idx}
                href={link.href}
                className="text-[#C1C8D2] hover:text-[#0062A6] text-sm transition-colors"
              >
                {link.title}
              </Link>
            ))}
          </div>
          
          <div>
            <select 
              className="bg-[#1E1E1E] border border-[#A9A9A9] text-[#C1C8D2] rounded-md py-1 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#28D7A0]"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  )
} 