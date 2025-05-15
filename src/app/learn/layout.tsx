'use client'

import React from 'react'
import ContentLayout from '@/components/layout/ContentLayout'
import LearningPathSidebar from '@/components/features/LearningPathSidebar'
import MainLayout from '@/components/layout/MainLayout'
import type { ReactNode } from 'react'

// Define the types to match the LearningPathSidebar component
type LessonStatus = 'completed' | 'in-progress' | 'locked';

interface Lesson {
  id: string;
  title: string;
  duration: string;
  status: LessonStatus;
}

interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

// Sample data - In a real app, this would come from an API
const mockModules: Module[] = [
  {
    id: 'module-1',
    title: 'Web Development Fundamentals',
    lessons: [
      {
        id: 'lesson-1',
        title: 'HTML Basics',
        duration: '20 min',
        status: 'completed',
      },
      {
        id: 'lesson-2',
        title: 'CSS Styling',
        duration: '25 min',
        status: 'completed',
      },
      {
        id: 'lesson-3',
        title: 'JavaScript Introduction',
        duration: '30 min',
        status: 'in-progress',
      },
    ],
  },
  {
    id: 'module-2',
    title: 'Frontend Development',
    lessons: [
      {
        id: 'lesson-4',
        title: 'React Basics',
        duration: '45 min',
        status: 'locked',
      },
      {
        id: 'lesson-5',
        title: 'State Management',
        duration: '40 min',
        status: 'locked',
      },
    ],
  },
]

export default function LearnLayout({
  children,
}: {
  children: ReactNode
}) {
  // In a real app, you'd load the current lesson data dynamically
  const currentLessonId = 'lesson-3'
  
  const handleSelectLesson = (lessonId: string) => {
    console.log('Selected lesson:', lessonId)
    // In a real app, you'd navigate to the selected lesson
  }

  return (
    <MainLayout>
      <ContentLayout
        sidebar={
          <div className="h-full">
            <LearningPathSidebar 
              modules={mockModules}
              currentLessonId={currentLessonId}
              onSelectLesson={handleSelectLesson}
            />
          </div>
        }
        maxWidth="max-w-7xl"
      >
        {children}
      </ContentLayout>
    </MainLayout>
  )
} 