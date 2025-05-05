'use client'

import React, { useState } from 'react'
import WorkspaceLayout from '@/components/layout/WorkspaceLayout'
import LearningPathSidebar from '@/components/features/LearningPathSidebar'
import ChallengeInstructions from '@/components/features/ChallengeInstructions'

// Define types for our data structures
type LessonStatus = 'completed' | 'in-progress' | 'locked'

interface Lesson {
  id: string
  title: string
  duration: string
  status: LessonStatus
}

interface Module {
  id: string
  title: string
  lessons: Lesson[]
}

// Mock data for the sidebar
const mockModules: Module[] = [
  {
    id: 'module-1',
    title: 'JavaScript Fundamentals',
    lessons: [
      { id: 'js-1', title: 'Variables & Data Types', duration: '15 min', status: 'completed' },
      { id: 'js-2', title: 'Functions & Scope', duration: '20 min', status: 'in-progress' },
      { id: 'js-3', title: 'Arrays & Objects', duration: '25 min', status: 'locked' },
    ],
  },
  {
    id: 'module-2',
    title: 'DOM Manipulation',
    lessons: [
      { id: 'dom-1', title: 'Selecting Elements', duration: '15 min', status: 'locked' },
      { id: 'dom-2', title: 'Event Handling', duration: '20 min', status: 'locked' },
      { id: 'dom-3', title: 'Creating & Modifying Elements', duration: '25 min', status: 'locked' },
    ],
  },
]

// Mock data for the challenge instructions
const mockChallenge = {
  title: 'Create a Counter Function',
  difficulty: 'easy' as 'easy' | 'medium' | 'hard',
  description:
    'In this challenge, you will create a counter function that increments a value each time it is called.',
  examples: [
    {
      input: 'const counter = createCounter(); counter(); counter(); counter();',
      expectedOutput: '1, 2, 3',
    },
  ],
  constraints: [
    'Use a closure to maintain the state of the counter',
    'The counter should start at 0',
    'The returned function should return the current count',
  ],
}

export default function PracticeLayout({ children }: { children: React.ReactNode }) {
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null)

  const handleSelectLesson = (lessonId: string) => {
    console.log('Selected lesson:', lessonId)
    setSelectedLessonId(lessonId)
  }

  return (
    <WorkspaceLayout
      sidebar={
        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-8">Practice Challenges</h2>
          <LearningPathSidebar
            modules={mockModules}
            currentLessonId={selectedLessonId || ''}
            onSelectLesson={handleSelectLesson}
          />
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 h-[calc(100vh-4rem)]">
        <div className="p-6 border-r border-gray-800 overflow-y-auto">
          <ChallengeInstructions {...mockChallenge} />
        </div>
        <div className="p-6 overflow-y-auto">
          {children}
        </div>
      </div>
    </WorkspaceLayout>
  )
} 