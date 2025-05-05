'use client'

import { ReactNode } from 'react'
import MainLayout from './MainLayout'

interface CommunityLayoutProps {
  children: ReactNode
  sidebar?: ReactNode
}

const CommunityLayout = ({ children, sidebar }: CommunityLayoutProps) => {
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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