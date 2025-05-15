'use client'

import React from 'react'
import Navbar from './Navbar'
import Footer from '@/components/Footer'
import LoadingSkeleton from '../shared/LoadingSkeleton'
import type { ReactNode } from 'react'

interface MainLayoutProps {
  children: ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <div className="h-16 bg-background border-b border-gray-800 fixed top-0 left-0 right-0 z-50">
          <LoadingSkeleton className="h-full" />
        </div>
        <main className="pt-16 flex-grow">
          <div className="max-w-7xl mx-auto p-6">
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <div key={i}>
                  <LoadingSkeleton className="h-48 w-full" />
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="pt-16 flex-grow">
        <div className="max-w-[1800px] mx-auto p-12">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  )
} 