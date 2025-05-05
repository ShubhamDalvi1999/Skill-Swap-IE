'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface Course {
  id: string
  title: string
  description: string
  thumbnail: string
  price: number
  level: string
  duration: number
  studentsCount: number
}

export default function CourseList() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCourses() {
      try {
        const response = await fetch('/api/courses')
        if (!response.ok) {
          throw new Error('Failed to fetch courses')
        }
        const data = await response.json()
        setCourses(data)
      } catch (err) {
        console.error('Error fetching courses:', err)
        setError('Failed to load courses')
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
        >
          Try Again
        </button>
      </div>
    )
  }

  if (courses.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500 mb-4">No courses found</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <Link 
          href={`/courses/${course.id}`} 
          key={course.id}
          className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
        >
          <div className="relative h-48">
            <Image
              src={course.thumbnail}
              alt={course.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
            <p className="text-gray-400 mb-4 line-clamp-2">{course.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-primary font-bold">${course.price.toFixed(2)}</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-400">{course.level}</span>
                <span className="text-sm text-gray-400">•</span>
                <span className="text-sm text-gray-400">{course.duration}h</span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
} 