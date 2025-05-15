'use client'

import React from 'react'
import { notFound } from 'next/navigation'
import MainLayout from '@/components/layout/MainLayout'
import ContentLayout from '@/components/layout/ContentLayout'
import LearningPathSidebar from '@/components/features/LearningPathSidebar'
import type { Course } from '@/types/course'

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

// Mock data - In a real app, this would come from an API based on the courseId
const coursesData: Record<string, Course> = {
  '1': {
    id: '1',
    title: 'Web Development Fundamentals',
    description: 'Learn the basics of web development with HTML, CSS, and JavaScript.',
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
    description: 'Master React.js and build modern web applications.',
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

// Example course modules - In a real app, this would be dynamic based on courseId
const courseModules: Record<string, Module[]> = {
  '1': [
    {
      id: 'module-1',
      title: 'HTML Basics',
      lessons: [
        {
          id: 'lesson-1',
          title: 'Introduction to HTML',
          duration: '20 min',
          status: 'completed',
        },
        {
          id: 'lesson-2',
          title: 'HTML Elements & Structure',
          duration: '25 min',
          status: 'completed',
        },
        {
          id: 'lesson-3',
          title: 'Forms & Input Elements',
          duration: '30 min',
          status: 'in-progress',
        },
      ],
    },
    {
      id: 'module-2',
      title: 'CSS Styling',
      lessons: [
        {
          id: 'lesson-4',
          title: 'CSS Selectors',
          duration: '30 min',
          status: 'locked',
        },
        {
          id: 'lesson-5',
          title: 'CSS Box Model',
          duration: '35 min',
          status: 'locked',
        },
      ],
    },
  ],
  '2': [
    {
      id: 'module-1',
      title: 'React Fundamentals',
      lessons: [
        {
          id: 'lesson-1',
          title: 'Introduction to React',
          duration: '25 min',
          status: 'completed',
        },
        {
          id: 'lesson-2',
          title: 'Components & Props',
          duration: '35 min',
          status: 'in-progress',
        },
        {
          id: 'lesson-3',
          title: 'State & Lifecycle',
          duration: '40 min',
          status: 'locked',
        },
      ],
    },
  ],
}

export default function CourseLearnPage({ params }: { params: { courseId: string } }) {
  const { courseId } = params
  const course = coursesData[courseId]
  const modules = courseModules[courseId] || []
  
  if (!course) {
    return notFound()
  }

  // In a real app, you'd load the current lesson data dynamically
  const currentLessonId = modules[0]?.lessons[0]?.id || ''
  
  const handleSelectLesson = (lessonId: string) => {
    console.log('Selected lesson:', lessonId)
    // In a real app, you'd navigate to the selected lesson or update state
  }

  return (
    <MainLayout>
      <ContentLayout
        sidebar={
          <div className="h-full">
            <LearningPathSidebar 
              modules={modules}
              currentLessonId={currentLessonId}
              onSelectLesson={handleSelectLesson}
            />
          </div>
        }
      >
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">{course.title}</h1>
          </div>

          <div className="bg-secondary rounded-xl p-6 border border-gray-800">
            <h2 className="text-xl font-semibold mb-4">Welcome to this course!</h2>
            <p className="text-gray-300">
              This is the learning area for {course.title}. Select a lesson from the sidebar to begin your learning journey.
            </p>
            
            <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
              <h3 className="font-medium text-primary mb-2">Course Progress</h3>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full" 
                  style={{ width: '10%' }}
                />
              </div>
              <p className="mt-2 text-sm text-gray-400">You've completed 10% of this course</p>
            </div>
          </div>
        </div>
      </ContentLayout>
    </MainLayout>
  )
} 