'use client'

import React, { useState } from 'react'
import JavaScriptLessonContent from '@/components/features/JavaScriptLessonContent'
import { useRouter } from 'next/navigation'

interface LessonPageProps {
  params: {
    lessonId: string;
  };
}

export default function LessonPage({ params }: LessonPageProps) {
  const { lessonId } = params;
  const [activeTab, setActiveTab] = useState<'learn' | 'practice'>('learn');
  const router = useRouter();

  // Validate if this is a valid lesson ID
  const isValidLesson = lessonId.startsWith('js-');
  
  if (!isValidLesson) {
    // Redirect to practice home page if invalid lesson
    router.push('/practice');
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-800">
        <button
          type="button"
          onClick={() => setActiveTab('learn')}
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === 'learn'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          Learn
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('practice')}
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === 'practice'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          Practice
        </button>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'learn' ? (
        <JavaScriptLessonContent lessonId={lessonId} />
      ) : (
        <div className="text-center p-10">
          <h2 className="text-xl font-semibold mb-4">Practice Challenge</h2>
          <p className="text-gray-400 mb-6">
            This feature is integrated into the main practice workflow.
            Please use the Practice tab in the main navigation to access challenges.
          </p>
          <button
            type="button"
            onClick={() => {
              window.location.href = '/practice';
            }}
            className="px-4 py-2 bg-primary rounded-md hover:bg-primary-600 transition-colors text-secondary"
          >
            Go to Practice Area
          </button>
        </div>
      )}
    </div>
  );
} 