import { User } from './user'

/**
 * Course related type definitions
 */

export interface Course {
  id: string
  title: string
  description: string
  instructor: string
  category: string
  level: 'beginner' | 'intermediate' | 'advanced'
  rating: number
  students_count: number
  duration: number
  published_date: string
  thumbnail: string
  price: number
  progress?: number
  enrolled_date?: string
}

export interface UserCourse extends Course {
  progress: number
  lastAccessed: Date
  status: 'not-started' | 'in-progress' | 'completed'
}

export interface CourseModule {
  id: string
  title: string
  description: string
  duration: number
  lessons: Lesson[]
}

export interface Lesson {
  id: string
  title: string
  duration: number
  videoUrl: string
  completed: boolean
}

export interface CourseResource {
  id: string
  title: string
  type: 'pdf' | 'code' | 'video' | 'link'
  url: string
}

export interface CourseRecommendation {
  course: Course
  score: number
  reason: string
}

export interface CourseProgress {
  courseId: string
  userId: string
  progress: number
  startedAt: Date
  lastAccessedAt: Date
  completedLessons: string[] // Array of lesson IDs
}

export interface CourseReview {
  id: string
  user: string
  avatar: string
  rating: number
  comment: string
  date: string
}

export interface CourseSection {
  id: string
  title: string
  lessons: {
    id: string
    title: string
    duration: string
    completed: boolean
  }[]
}

export interface CourseDetails extends Course {
  syllabus: CourseModule[]
  resources: CourseResource[]
  reviews: CourseReview[]
  requirements: string[]
  what_you_will_learn: string[]
}

export interface CourseSearchParams {
  query: string
  category: string | null
  level: 'beginner' | 'intermediate' | 'advanced' | null
  sortBy: 'newest' | 'popular' | 'rating'
} 