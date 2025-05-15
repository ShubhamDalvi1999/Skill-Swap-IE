'use client'

import React, { useState } from 'react'

interface MobilePracticeLayoutProps {
  challengeView: React.ReactNode
  editorView: React.ReactNode
}

/**
 * Mobile optimized layout for Practice section that uses tabs to toggle between
 * challenge instructions and code editor. Only displayed on small screens.
 */
export default function MobilePracticeLayout({ 
  challengeView, 
  editorView 
}: MobilePracticeLayoutProps) {
  const [activeTab, setActiveTab] = useState<'instructions' | 'editor'>('instructions')

  return (
    <div className="md:hidden">
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-800 mb-4">
        <button
          type="button"
          onClick={() => setActiveTab('instructions')}
          className={`flex-1 px-4 py-2 text-sm font-medium ${
            activeTab === 'instructions'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          Instructions
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('editor')}
          className={`flex-1 px-4 py-2 text-sm font-medium ${
            activeTab === 'editor'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          Code Editor
        </button>
      </div>

      {/* Active Tab Content */}
      <div className="bg-secondary rounded-xl border border-gray-800 overflow-hidden">
        <div className={activeTab === 'instructions' ? 'block' : 'hidden'}>
          {challengeView}
        </div>
        <div className={activeTab === 'editor' ? 'block' : 'hidden'}>
          {editorView}
        </div>
      </div>
    </div>
  )
} 