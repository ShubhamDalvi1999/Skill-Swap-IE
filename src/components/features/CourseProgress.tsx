import React from 'react'

const PLACEHOLDER_COURSES = [
  {
    id: 1,
    title: "Web Development Fundamentals",
    progress: 75,
    emoji: "💻"
  },
  {
    id: 2,
    title: "UI/UX Design Principles",
    progress: 45,
    emoji: "🎨"
  },
  {
    id: 3,
    title: "Mobile App Development",
    progress: 20,
    emoji: "📱"
  }
]

export function CourseProgress() {
  return (
    <div className="bg-secondary/80 backdrop-blur-sm rounded-xl p-8 w-[360px]">
      <h3 className="text-2xl font-semibold mb-8">Course Progress</h3>
      <div className="space-y-6">
        {PLACEHOLDER_COURSES.map((course) => (
          <div key={course.id} className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-medium mb-1">{course.title}</p>
                <p className="text-base text-gray-400">{course.progress}% Complete</p>
              </div>
              <span className="text-3xl">{course.emoji}</span>
            </div>
            <div className="h-3 bg-background rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${course.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 