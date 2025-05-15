'use client'

import React, { useState } from 'react'
import WorkspaceLayout from '@/components/layout/WorkspaceLayout'
import LearningPathSidebar from '@/components/features/LearningPathSidebar'
import ChallengeInstructions from '@/components/features/ChallengeInstructions'
import MobilePracticeLayout from './mobile-layout'
import type { ReactNode } from 'react'

// Define types for our data structures
type LessonStatus = 'completed' | 'in-progress' | 'locked'
type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced'

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

interface Challenge {
  id: string
  title: string
  difficulty: 'easy' | 'medium' | 'hard'
  description: string
  examples: {
    input: string
    expectedOutput: string
  }[]
  constraints: string[]
  starterCode: string
  testCases: string
  solution: string
}

// JavaScript curriculum modules
const javaScriptModules: Module[] = [
  {
    id: 'js-basics',
    title: 'JavaScript Fundamentals',
    lessons: [
      { id: 'js-vars', title: 'Variables & Data Types', duration: '15 min', status: 'completed' },
      { id: 'js-operators', title: 'Operators & Expressions', duration: '15 min', status: 'completed' },
      { id: 'js-control', title: 'Control Flow', duration: '20 min', status: 'in-progress' },
      { id: 'js-functions', title: 'Functions & Scope', duration: '25 min', status: 'locked' },
      { id: 'js-arrays', title: 'Arrays & Array Methods', duration: '25 min', status: 'locked' },
      { id: 'js-objects', title: 'Objects & Properties', duration: '25 min', status: 'locked' },
    ],
  },
  {
    id: 'js-intermediate',
    title: 'Intermediate JavaScript',
    lessons: [
      { id: 'js-closures', title: 'Closures & Higher-Order Functions', duration: '30 min', status: 'locked' },
      { id: 'js-this', title: 'The "this" Keyword', duration: '25 min', status: 'locked' },
      { id: 'js-prototypes', title: 'Prototypes & Inheritance', duration: '35 min', status: 'locked' },
      { id: 'js-async', title: 'Asynchronous JavaScript', duration: '40 min', status: 'locked' },
      { id: 'js-fetch', title: 'Fetch API & Promises', duration: '30 min', status: 'locked' },
      { id: 'js-modules', title: 'ES Modules & Imports', duration: '25 min', status: 'locked' },
    ],
  },
  {
    id: 'js-advanced',
    title: 'Advanced JavaScript',
    lessons: [
      { id: 'js-patterns', title: 'Design Patterns', duration: '45 min', status: 'locked' },
      { id: 'js-performance', title: 'Performance Optimization', duration: '35 min', status: 'locked' },
      { id: 'js-memory', title: 'Memory Management', duration: '30 min', status: 'locked' },
      { id: 'js-testing', title: 'Testing JavaScript Code', duration: '40 min', status: 'locked' },
      { id: 'js-frameworks', title: 'Framework Fundamentals', duration: '45 min', status: 'locked' },
    ],
  },
]

// Collection of JavaScript challenges
const jsChallenges: Record<string, Challenge> = {
  'js-control': {
    id: 'challenge-control-flow',
    title: 'Create a FizzBuzz Function',
    difficulty: 'easy',
    description: 
      'Write a function called "fizzBuzz" that takes a number as input and returns:\n' +
      '- "Fizz" if the number is divisible by 3\n' +
      '- "Buzz" if the number is divisible by 5\n' +
      '- "FizzBuzz" if the number is divisible by both 3 and 5\n' +
      '- The number itself as a string if none of the above conditions are met',
    examples: [
      {
        input: 'fizzBuzz(3)',
        expectedOutput: '"Fizz"',
      },
      {
        input: 'fizzBuzz(5)',
        expectedOutput: '"Buzz"',
      },
      {
        input: 'fizzBuzz(15)',
        expectedOutput: '"FizzBuzz"',
      },
      {
        input: 'fizzBuzz(7)',
        expectedOutput: '"7"',
      },
    ],
    constraints: [
      'Input will always be a positive integer',
      'Return a string, not a number',
      'Handle edge cases appropriately'
    ],
    starterCode: 
      '// Write your fizzBuzz function\n' +
      'function fizzBuzz(num) {\n' +
      '  // Your solution here\n' +
      '}',
    testCases: 
      'test("divisible by 3", () => {\n' +
      '  expect(fizzBuzz(3)).toBe("Fizz");\n' +
      '  expect(fizzBuzz(9)).toBe("Fizz");\n' +
      '});\n\n' +
      'test("divisible by 5", () => {\n' +
      '  expect(fizzBuzz(5)).toBe("Buzz");\n' +
      '  expect(fizzBuzz(10)).toBe("Buzz");\n' +
      '});\n\n' +
      'test("divisible by both 3 and 5", () => {\n' +
      '  expect(fizzBuzz(15)).toBe("FizzBuzz");\n' +
      '  expect(fizzBuzz(30)).toBe("FizzBuzz");\n' +
      '});\n\n' +
      'test("not divisible by 3 or 5", () => {\n' +
      '  expect(fizzBuzz(7)).toBe("7");\n' +
      '  expect(fizzBuzz(11)).toBe("11");\n' +
      '});',
    solution: 
      'function fizzBuzz(num) {\n' +
      '  if (num % 3 === 0 && num % 5 === 0) {\n' +
      '    return "FizzBuzz";\n' +
      '  } else if (num % 3 === 0) {\n' +
      '    return "Fizz";\n' +
      '  } else if (num % 5 === 0) {\n' +
      '    return "Buzz";\n' +
      '  } else {\n' +
      '    return String(num);\n' +
      '  }\n' +
      '}'
  },
  'js-functions': {
    id: 'challenge-counter',
    title: 'Create a Counter Function',
    difficulty: 'easy',
    description:
      'Write a function "createCounter" that returns a function that increments and returns a counter variable each time it is called. The counter should start at 1.',
    examples: [
      {
        input: 'const counter = createCounter(); counter(); counter(); counter();',
        expectedOutput: '1, 2, 3',
      },
    ],
    constraints: [
      'Use a closure to maintain the state of the counter',
      'The counter should start at 1',
      'The returned function should return the current count'
    ],
    starterCode: 
      '// Create a counter function that increments on each call\n' +
      'function createCounter() {\n' +
      '  // Your solution here\n' +
      '}',
    testCases: 
      'test("counter starts at 1", () => {\n' +
      '  const counter = createCounter();\n' +
      '  expect(counter()).toBe(1);\n' +
      '});\n\n' +
      'test("counter increments", () => {\n' +
      '  const counter = createCounter();\n' +
      '  expect(counter()).toBe(1);\n' +
      '  expect(counter()).toBe(2);\n' +
      '  expect(counter()).toBe(3);\n' +
      '});\n\n' +
      'test("separate counters are independent", () => {\n' +
      '  const counter1 = createCounter();\n' +
      '  const counter2 = createCounter();\n' +
      '  expect(counter1()).toBe(1);\n' +
      '  expect(counter1()).toBe(2);\n' +
      '  expect(counter2()).toBe(1);\n' +
      '  expect(counter1()).toBe(3);\n' +
      '  expect(counter2()).toBe(2);\n' +
      '});',
    solution: 
      'function createCounter() {\n' +
      '  let count = 0;\n' +
      '  return function() {\n' +
      '    count += 1;\n' +
      '    return count;\n' +
      '  };\n' +
      '}'
  }
}

// Default challenge
const defaultChallenge = jsChallenges['js-control'];

export default function PracticeLayout({ children }: { children: ReactNode }) {
  const [selectedLessonId, setSelectedLessonId] = useState<string>('js-control')
  const [currentChallenge, setCurrentChallenge] = useState<Challenge>(defaultChallenge)

  const handleSelectLesson = (lessonId: string) => {
    setSelectedLessonId(lessonId)
    
    // If we have a challenge for this lesson, load it
    if (jsChallenges[lessonId]) {
      setCurrentChallenge(jsChallenges[lessonId])
    }
  }

  return (
    <WorkspaceLayout
      sidebar={
        <div className="p-4 pb-10 flex flex-col items-center">
          <h2 className="text-2xl font-semibold mb-6 text-center">Practice Challenges</h2>
          <div className="mb-5 w-full">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-sm text-gray-300">Completed</span>
              <div className="w-2 h-2 rounded-full bg-yellow-500 ml-4" />
              <span className="text-sm text-gray-300">In Progress</span>
              <div className="w-2 h-2 rounded-full bg-gray-600 ml-4" />
              <span className="text-sm text-gray-300">Locked</span>
            </div>
          </div>
          <LearningPathSidebar
            modules={javaScriptModules}
            currentLessonId={selectedLessonId}
            onSelectLesson={handleSelectLesson}
          />
        </div>
      }
      maxWidth="max-w-6xl"
      sidebarWidth="w-80"
      contentPadding="px-6 sm:px-8 lg:px-10"
      showFooter={true}
    >
      <div className="py-6">
        {/* Mobile Layout - Only visible on smaller screens */}
        <MobilePracticeLayout
          challengeView={
            <div className="p-5">
              <ChallengeInstructions
                title={currentChallenge.title}
                difficulty={currentChallenge.difficulty}
                description={currentChallenge.description}
                examples={currentChallenge.examples}
                constraints={currentChallenge.constraints}
              />
            </div>
          }
          editorView={
            <div className="p-5">
              {children}
            </div>
          }
        />
        
        {/* Desktop Layout - Hidden on mobile, visible on larger screens */}
        <div className="hidden lg:flex lg:flex-col xl:flex-row gap-6 max-w-full">
          {/* Challenge Description Panel */}
          <section className="bg-secondary rounded-xl p-5 border border-gray-800 overflow-y-auto max-h-[calc(100vh-12rem)] w-full xl:w-1/2 flex-shrink-0">
            <ChallengeInstructions
              title={currentChallenge.title}
              difficulty={currentChallenge.difficulty}
              description={currentChallenge.description}
              examples={currentChallenge.examples}
              constraints={currentChallenge.constraints}
            />
          </section>
          
          {/* Code Editor Panel */}
          <section className="bg-secondary rounded-xl p-5 border border-gray-800 overflow-y-auto max-h-[calc(100vh-12rem)] w-full xl:w-1/2 flex-shrink-0">
            {children}
          </section>
        </div>
      </div>
    </WorkspaceLayout>
  )
} 