'use client'

import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import MainLayout from '@/components/layout/MainLayout'
import Icon from '@/components/ui/Icon'
import { Button } from '@/components/ui/button'
import { ICONS } from '@/lib/icons'
import type { Course } from '@/types/course'

// Mock data - In a real app, this would come from an API
const coursesData: Record<string, Course> = {
  '1': {
    id: '1',
    title: 'Web Development Fundamentals',
    description: 'Learn the basics of web development with HTML, CSS, and JavaScript. This comprehensive course will take you from a complete beginner to being able to create your own responsive websites.',
    instructor: 'John Doe',
    category: 'Web Development',
    level: 'beginner',
    rating: 4.8,
    students_count: 1234,
    duration: 56, // in days (8 weeks)
    published_date: '2023-01-15',
    thumbnail: 'https://picsum.photos/800/600?random=1',
    price: 49.99
  },
  '2': {
    id: '2',
    title: 'React.js Mastery',
    description: 'Master React.js and build modern web applications. This course covers components, hooks, state management, routing, and best practices for building scalable React applications.',
    instructor: 'Jane Smith',
    category: 'Frontend',
    level: 'intermediate',
    rating: 4.9,
    students_count: 856,
    duration: 70, // in days (10 weeks)
    published_date: '2023-02-10',
    thumbnail: 'https://picsum.photos/800/600?random=2',
    price: 59.99
  },
  // Add the rest of the courses here...
}

export default function CoursePage({ params }: { params: { courseId: string } }) {
  const { courseId } = params
  const course = coursesData[courseId]
  
  if (!course) {
    return notFound()
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <div className="bg-secondary rounded-xl overflow-hidden border border-gray-800">
          {/* Course Header with Image */}
          <div className="relative h-64">
            <img
              src={course.thumbnail || '/placeholder-course.jpg'}
              alt={course.title}
              className="object-cover w-full h-full"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-secondary via-transparent to-transparent"></div>
          </div>
          
          {/* Course Content */}
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
            
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center">
                <Icon name={ICONS.rating} className="w-5 h-5 text-yellow-500 mr-1" />
                <span>{course.rating.toFixed(1)}</span>
              </div>
              <div className="flex items-center">
                <Icon name={ICONS.students} className="w-5 h-5 mr-1" />
                <span>{course.students_count.toLocaleString()} students</span>
              </div>
              <div className="flex items-center">
                <Icon name={ICONS.duration} className="w-5 h-5 mr-1" />
                <span>{Math.ceil(course.duration / 7)} weeks</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 mb-6">
              <span className="bg-gray-700 text-sm px-2 py-1 rounded">{course.level}</span>
              <span className="bg-gray-700 text-sm px-2 py-1 rounded">{course.category}</span>
            </div>
            
            <h2 className="text-xl font-semibold mb-2">About this Course</h2>
            <p className="text-gray-300 mb-6">{course.description}</p>
            
            <div className="flex justify-between items-center border-t border-gray-800 pt-6">
              <div>
                <p className="text-gray-400">Instructor</p>
                <p className="font-medium">{course.instructor}</p>
              </div>
              
              <Link href={`/courses/${course.id}/learn`}>
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-secondary">
                  Start Learning
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
} 