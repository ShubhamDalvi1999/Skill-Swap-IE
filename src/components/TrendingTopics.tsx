'use client'

import React from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

// Sample trending topics data
const topics = [
  {
    id: 'react',
    name: 'React',
    icon: '⚛️',
    courses: 42,
    color: 'from-cyan-500 to-blue-500',
    slug: 'react'
  },
  {
    id: 'next',
    name: 'Next.js',
    icon: '▲',
    courses: 29,
    color: 'from-neutral-800 to-neutral-900',
    slug: 'nextjs'
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    icon: '𝗧𝗦',
    courses: 36,
    color: 'from-blue-500 to-blue-700',
    slug: 'typescript'
  },
  {
    id: 'python',
    name: 'Python',
    icon: '🐍',
    courses: 53,
    color: 'from-yellow-500 to-yellow-700',
    slug: 'python'
  },
  {
    id: 'ai',
    name: 'AI Development',
    icon: '🤖',
    courses: 19,
    color: 'from-purple-500 to-purple-800',
    slug: 'ai-development'
  },
  {
    id: 'aws',
    name: 'AWS',
    icon: '☁️',
    courses: 31,
    color: 'from-orange-500 to-orange-700',
    slug: 'aws'
  },
  {
    id: 'devops',
    name: 'DevOps',
    icon: '🔄',
    courses: 27,
    color: 'from-green-500 to-green-700',
    slug: 'devops'
  },
  {
    id: 'ui',
    name: 'UI Design',
    icon: '🎨',
    courses: 24,
    color: 'from-pink-500 to-pink-700',
    slug: 'ui-design'
  },
]

export default function TrendingTopics() {
  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[#0062A6] mb-4">Trending Skills to Learn</h2>
          <p className="text-[#1E1E1E] max-w-2xl mx-auto">
            Stay ahead with the most in-demand skills that employers are looking for right now.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {topics.map((topic) => (
            <Link 
              key={topic.id} 
              href={`/topics/${topic.slug}`}
              className="block group"
            >
              <div className={`bg-gradient-to-br ${topic.color} p-6 rounded-lg shadow-lg h-full border border-[#A9A9A9] group-hover:border-[#FF78C4] transition-all duration-300 group-hover:shadow-[#FF78C4]/20 group-hover:shadow-xl`}>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-4xl mb-3 block">{topic.icon}</span>
                    <h3 className="text-xl font-bold text-white mb-1">{topic.name}</h3>
                    <p className="text-white/70 text-sm">{topic.courses} courses</p>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-all">
                    <ChevronRight className="h-5 w-5 text-white" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        <div className="text-center mt-10">
          <Link href="/topics">
            <button 
              type="button"
              className="px-6 py-3 bg-[#FFD644] hover:bg-[#28D7A0] text-[#1E1E1E] rounded-md font-medium inline-flex items-center"
            >
              View All Topics
              <ChevronRight className="ml-2 h-5 w-5" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
} 