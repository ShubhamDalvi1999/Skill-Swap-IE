'use client'

import React from 'react'
import { AuthProvider } from '@/context/AuthContext'
import { ToastProvider } from '@/components/shared/ToastProvider'
import DatabaseInitializer from '@/components/DatabaseInitializer'
import type { ReactNode } from 'react'

interface ProvidersProps {
  children: ReactNode
}

/**
 * Component that wraps the application with all necessary context providers
 */
export default function Providers({ children }: ProvidersProps) {
  return (
    <AuthProvider>
      <ToastProvider>
        {/* Initialize database on application startup */}
        <DatabaseInitializer />
        {children}
      </ToastProvider>
    </AuthProvider>
  )
} 