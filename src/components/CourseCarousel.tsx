'use client'

import React from 'react'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

// Sample course data - in a real app, you would fetch this from an API
const courses = [
  {
    id: 1,
    title: 'From Tutorial Hell to Real Projects',
    instructor: 'Sarah Johnson',
    rating: 4.9,
    studentsCount: 12340,
    image: '/images/courses/tutorial-hell.jpg',
    price: '$49.99',
    slug: 'tutorial-hell-to-projects'
  },
  {
    id: 2,
    title: 'Building Your Developer Portfolio',
    instructor: 'Michael Chen',
    rating: 4.8,
    studentsCount: 8790,
    image: '/images/courses/portfolio.jpg',
    price: '$39.99',
    slug: 'build-developer-portfolio'
  },
  {
    id: 3,
    title: 'Problem Solving for Programmers',
    instructor: 'Alex Kumar',
    rating: 4.9,
    studentsCount: 10245,
    image: '/images/courses/problem-solving.jpg',
    price: '$59.99',
    slug: 'problem-solving-programmers'
  },
  {
    id: 4,
    title: 'Personalized Learning Path Creation',
    instructor: 'Emily Zhang',
    rating: 4.7,
    studentsCount: 6530,
    image: '/images/courses/learning-path.jpg',
    price: '$44.99',
    slug: 'personalized-learning-paths'
  },
  {
    id: 5,
    title: 'Building Projects that Get You Hired',
    instructor: 'David Wilson',
    rating: 4.8,
    studentsCount: 9120,
    image: '/images/courses/get-hired.jpg',
    price: '$54.99',
    slug: 'projects-get-hired'
  },
  {
    id: 6,
    title: 'Mastering Code Reviews',
    instructor: 'Priya Sharma',
    rating: 4.7,
    studentsCount: 5890,
    image: '/images/courses/code-reviews.jpg',
    price: '$39.99',
    slug: 'mastering-code-reviews'
  },
]

export default function CourseCarousel() {
  const scrollRef = React.useRef<HTMLDivElement>(null)
  
  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { current } = scrollRef
      const scrollAmount = direction === 'left' 
        ? -current.clientWidth / 2 
        : current.clientWidth / 2
      
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  return (
    <div className="py-16 bg-transparent">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0062A6]">Professional Skills to Escape Tutorial Hell</h2>
          <div className="flex space-x-2">
            <button 
              onClick={() => scroll('left')} 
              className="p-2 rounded-full bg-[#FFD644] hover:bg-[#FF78C4] text-[#1E1E1E]"
              type="button"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button 
              onClick={() => scroll('right')} 
              className="p-2 rounded-full bg-[#FFD644] hover:bg-[#FF78C4] text-[#1E1E1E]"
              type="button"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        </div>
        
        <div 
          ref={scrollRef}
          className="flex space-x-6 overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {courses.map((course) => (
            <div 
              key={course.id} 
              className="flex-shrink-0 w-[280px] snap-start bg-[#0062A6] rounded-lg overflow-hidden shadow-xl border border-[#A9A9A9] hover:border-[#FF78C4] transition-all duration-300 hover:shadow-[#FF78C4]/30 hover:shadow-lg"
            >
              <div className="relative h-[160px] w-full bg-[#1E1E1E]">
                <div className="absolute inset-0 flex items-center justify-center bg-[#1E1E1E] text-[#C1C8D2]">
                  <div className="text-4xl font-bold">SkillSwap</div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg text-white mb-1 line-clamp-2">{course.title}</h3>
                <p className="text-[#C1C8D2] text-sm mb-2">{course.instructor}</p>
                <div className="flex items-center mb-1">
                  <span className="text-[#FFD644] font-bold mr-1">{course.rating}</span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 ${i < Math.floor(course.rating) ? 'text-[#FFD644]' : 'text-[#A9A9A9]'}`}
                        fill={i < Math.floor(course.rating) ? 'currentColor' : 'none'}
                      />
                    ))}
                  </div>
                  <span className="text-[#C1C8D2] text-xs ml-2">({course.studentsCount.toLocaleString()})</span>
                </div>
                <div className="flex justify-between items-center mt-3">
                  <span className="font-bold text-[#28D7A0]">{course.price}</span>
                  <Link href={`/courses/${course.slug}`}>
                    <button 
                      className="px-3 py-1 bg-[#FFD644] hover:bg-[#28D7A0] text-[#1E1E1E] text-sm rounded"
                      type="button"
                    >
                      View Course
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-8">
          <Link href="/courses">
            <button 
              className="px-6 py-3 bg-[#FFD644] hover:bg-[#28D7A0] text-[#1E1E1E] rounded-md font-semibold"
              type="button"
            >
              Browse All Courses
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
} 