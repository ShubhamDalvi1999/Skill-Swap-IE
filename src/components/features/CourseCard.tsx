'use client'

import Link from 'next/link'
import Icon from '@/components/ui/Icon'
import { ICONS } from '@/lib/icons'
import type { Course, UserCourse } from '@/types/course'

interface CourseCardProps {
  course: Course | UserCourse
  showProgress?: boolean
}

export default function CourseCard({ course, showProgress = false }: CourseCardProps) {
  if (!course) {
    return null
  }

  const isUserCourse = 'progress' in course && typeof course.progress === 'number'

  return (
    <Link href={`/courses/${course.id}`}>
      <div className="bg-secondary rounded-xl overflow-hidden border border-gray-800 hover:border-primary/50 transition-colors">
        {/* Course Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={course.thumbnail || '/placeholder-course.jpg'}
            alt={course.title}
            className="object-cover w-full h-full transition-transform hover:scale-105 duration-300"
            style={{ objectPosition: 'center' }}
          />
          {isUserCourse && showProgress && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
              <div 
                className="h-full bg-primary"
                style={{ width: `${(course as UserCourse).progress}%` }}
              />
            </div>
          )}
        </div>

        {/* Course Info */}
        <div className="p-4">
          <h3 className="font-semibold mb-2 line-clamp-1">{course.title}</h3>
          <p className="text-sm text-gray-400 mb-4 line-clamp-2">
            {course.description}
          </p>

          {/* Course Stats */}
          <div className="flex items-center justify-between text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <Icon name={ICONS.duration} className="w-4 h-4" />
              <span>{course.duration} days</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name={ICONS.students} className="w-4 h-4" />
              <span>{course.students_count ? course.students_count.toLocaleString() : '0'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name={ICONS.rating} className="w-4 h-4 text-yellow-500" />
              <span>{course.rating ? course.rating.toFixed(1) : '0.0'}</span>
            </div>
          </div>

          {/* Progress Info */}
          {isUserCourse && showProgress && (
            <div className="mt-4 pt-4 border-t border-gray-800">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Progress</span>
                <span className="text-primary">{(course as UserCourse).progress}%</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
} 