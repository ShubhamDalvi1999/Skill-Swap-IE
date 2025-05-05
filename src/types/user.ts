/**
 * User profile type definitions
 */
export interface UserProfile {
  id: string
  email: string
  full_name: string
  username?: string
  bio?: string
  avatar_url?: string
  location?: string
  website?: string
  role: 'student' | 'instructor' | 'admin'
  skills?: string[]
  joined_date: string
  last_seen: string
}

export interface UserSession {
  id: string
  email: string
  role: string
}

export interface UserStats {
  totalCoursesEnrolled: number
  totalCoursesCompleted: number
  totalHoursLearned: number
  averageProgress: number
}

export interface User {
  id: string
  email: string
  profile?: UserProfile
  [key: string]: any
} 