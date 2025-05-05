import React from 'react'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any
    }
  }
}

export interface User {
  id: string
  name: string
  email: string
  role: 'student' | 'instructor'
  avatar: string
}

export interface CourseCardProps {
  id: string
  title: string
  description: string
  duration: string
  progress: number
  image: string
}

export interface ContentLayoutProps {
  children: React.ReactNode
  sidebar?: React.ReactNode
  showProgress?: boolean
  progress?: number
} 