'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface ContentLayoutProps {
  children: React.ReactNode
  sidebar?: React.ReactNode
  showProgress?: boolean
  progress?: number
}

export default function ContentLayout({
  children,
  sidebar,
  showProgress = false,
  progress = 0,
}: ContentLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  return (
    <div className="h-[calc(100vh-4rem)] flex">
      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? 'w-80' : 'w-0'
        } bg-secondary border-r border-gray-800 transition-all duration-300 overflow-hidden`}
      >
        {sidebar}
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-secondary p-2 rounded-r-lg border border-l-0 border-gray-800"
      >
        {isSidebarOpen ? (
          <ChevronLeft className="w-4 h-4" />
        ) : (
          <ChevronRight className="w-4 h-4" />
        )}
      </button>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {showProgress && (
          <div className="h-1 bg-gray-800">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  )
} 