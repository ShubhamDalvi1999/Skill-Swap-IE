'use client'

import Icon from '@/components/ui/Icon'
import { ICONS } from '@/lib/icons'
import { cn } from '@/lib/utils'

interface Module {
  id: string
  title: string
  lessons: {
    id: string
    title: string
    duration: string
    status: 'completed' | 'in-progress' | 'locked'
  }[]
}

interface LearningPathSidebarProps {
  modules: Module[]
  currentLessonId?: string
  onSelectLesson: (lessonId: string) => void
}

export default function LearningPathSidebar({
  modules,
  currentLessonId,
  onSelectLesson,
}: LearningPathSidebarProps) {
  const getStatusIcon = (status: 'completed' | 'in-progress' | 'locked' | string) => {
    switch (status) {
      case 'completed':
        return <Icon name={ICONS.completed} className="text-success-500" size={20} />
      case 'in-progress':
        return <Icon name={ICONS.inProgress} className="text-primary-500" size={20} />
      case 'locked':
        return <Icon name={ICONS.locked} className="text-secondary-400" size={20} />
      default:
        return <Icon name={ICONS.notStarted} className="text-secondary-400" size={20} />
    }
  }

  return (
    <div className="h-full overflow-y-auto bg-secondary-900 border-r border-secondary-800">
      <div className="p-6">
        <h2 className="text-2xl font-vt323 tracking-wide mb-8 text-primary-400">Course Content</h2>
        <div className="space-y-8">
          {modules.map((module) => (
            <div key={module.id} className="border-b border-secondary-800 pb-6 last:border-0">
              <h3 className="text-lg font-medium text-secondary-300 mb-4">{module.title}</h3>
              <div className="space-y-2">
                {module.lessons.map((lesson) => (
                  <button
                    key={lesson.id}
                    onClick={() => lesson.status !== 'locked' && onSelectLesson(lesson.id)}
                    className={cn(
                      "w-full flex items-center justify-between p-4 rounded-lg transition-all duration-200",
                      currentLessonId === lesson.id
                        ? "bg-secondary-800 border-l-4 border-primary-500"
                        : "hover:bg-secondary-800/50",
                      lesson.status === 'locked' 
                        ? "opacity-50 cursor-not-allowed" 
                        : "cursor-pointer"
                    )}
                    type="button"
                  >
                    <div className="flex items-center space-x-4">
                      {getStatusIcon(lesson.status)}
                      <span className={cn(
                        "text-base",
                        currentLessonId === lesson.id ? "text-white" : "text-secondary-200"
                      )}>
                        {lesson.title}
                      </span>
                    </div>
                    <span className="text-sm text-secondary-400">{lesson.duration}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 