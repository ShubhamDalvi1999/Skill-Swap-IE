'use client'

import { ReactNode } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'

interface WorkspaceLayoutProps {
  children: ReactNode
  sidebar: ReactNode
  showFooter?: boolean
}

const WorkspaceLayout = ({ 
  children, 
  sidebar,
  showFooter = false
}: WorkspaceLayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <div className="flex flex-1 pt-16">
        {/* Sidebar */}
        <div className="hidden md:block w-80 border-r border-gray-800 h-[calc(100vh-4rem)] sticky top-16 bg-secondary overflow-auto">
          {sidebar}
        </div>
        
        {/* Main content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
      
      {showFooter && <Footer />}
    </div>
  )
}

export default WorkspaceLayout 