'use client'

import type { ReactNode } from 'react'
import Navbar from './Navbar'
import Footer from '@/components/Footer'

interface WorkspaceLayoutProps {
  children: ReactNode
  sidebar: ReactNode
  showFooter?: boolean
  maxWidth?: string
  sidebarWidth?: string
  contentPadding?: string
}

const WorkspaceLayout = ({ 
  children, 
  sidebar,
  showFooter = false,
  maxWidth = "max-w-7xl", // Default max width, can be overridden
  sidebarWidth = "w-72", // Default sidebar width, can be overridden
  contentPadding = "px-4 sm:px-6 lg:px-8" // Default padding, can be overridden
}: WorkspaceLayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <div className="flex flex-1 pt-16 w-full">
        {/* Sidebar - fixed width, sticky, with proper scrolling */}
        <aside className={`hidden md:block ${sidebarWidth} flex-shrink-0 border-r border-gray-800 h-[calc(100vh-4rem)] sticky top-16 bg-secondary overflow-y-auto`}>
          <div className="h-full">
            {sidebar}
          </div>
        </aside>
        
        {/* Main content with proper centering and max-width */}
        <main className="flex-1 w-full min-w-0">
          <div className={`mx-auto ${contentPadding} ${maxWidth} h-full`}>
            {children}
          </div>
        </main>
      </div>
      
      {showFooter && <Footer />}
    </div>
  )
}

export default WorkspaceLayout 