'use client'

import type { ReactNode } from 'react'
import MainLayout from './MainLayout'

interface CommunityLayoutProps {
  children: ReactNode
  sidebar?: ReactNode
  maxWidth?: string
}

const CommunityLayout = ({ 
  children, 
  sidebar, 
  maxWidth = "max-w-7xl" 
}: CommunityLayoutProps) => {
  return (
    <MainLayout>
      <div className={`${maxWidth} mx-auto px-4 sm:px-6 lg:px-8 py-8`}>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Main content */}
          <main className="flex-1 min-w-0">
            {children}
          </main>
          
          {/* Sidebar */}
          {sidebar && (
            <aside className="md:w-80 lg:w-96 flex-shrink-0 order-first md:order-last">
              {sidebar}
            </aside>
          )}
        </div>
      </div>
    </MainLayout>
  )
}

export default CommunityLayout 