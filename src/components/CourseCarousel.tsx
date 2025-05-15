'use client'

import React from 'react'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

// Sample course data - in a real app, you would fetch this from an API
const courses = [
  {
    id: 1,
    title: 'Playing a Ukulele',
    instructor: 'Sarah Johnson',
    rating: 4.9,
    studentsCount: 12340,
    image: '/images/courses/ukulele.jpg',
    price: '500 tokens',
    slug: 'tutorial-hell-to-projects'
  },
  {
    id: 2,
    title: 'Artificial Intelligence & Human Collaboration',
    instructor: 'Michael Chen',
    rating: 4.8,
    studentsCount: 8790,
    image: '/images/courses/ai-collaboration.jpg',
    price: '400 tokens',
    slug: 'build-developer-portfolio'
  },
  {
    id: 3,
    title: 'Public Speaking & Presentation Skills',
    instructor: 'Alex Kumar',
    rating: 4.9,
    studentsCount: 10245,
    image: '/images/courses/public-speaking.jpg',
    price: '600 tokens',
    slug: 'problem-solving-programmers'
  },
  {
    id: 4,
    title: 'Advanced Chess Strategy',
    instructor: 'Emily Zhang',
    rating: 4.7,
    studentsCount: 6530,
    image: '/images/courses/chess.jpg',
    price: '450 tokens',
    slug: 'personalized-learning-paths'
  },
  {
    id: 5,
    title: 'Crypto & Blockchain Fundamentals',
    instructor: 'David Wilson',
    rating: 4.8,
    studentsCount: 9120,
    image: '/images/courses/blockchain.jpg',
    price: '550 tokens',
    slug: 'projects-get-hired'
  },
  {
    id: 6,
    title: 'Mastering Code Reviews',
    instructor: 'Priya Sharma',
    rating: 4.7,
    studentsCount: 5890,
    image: '/images/courses/code-reviews.png',
    price: '400 tokens',
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
          <h2 className="text-3xl md:text-4xl font-bold text-[#0062A6]">Explore Our Popular Courses</h2>
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
                <Image 
                  src={course.image}
                  alt={`${course.title} course image`}
                  fill
                  sizes="280px"
                  className="object-cover w-full h-full"
                  style={{ objectPosition: 'center' }}
                />
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