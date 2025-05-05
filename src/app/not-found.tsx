// @ts-nocheck
'use client'

import Link from 'next/link'
import Icon from '@/components/ui/Icon'
import { ICONS } from '@/lib/icons'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="space-y-6">
          {/* 404 Text */}
          <h1 className="text-9xl font-bold text-primary">404</h1>
          
          {/* Message */}
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">Page Not Found</h2>
            <p className="text-gray-400">
              Oops! The page you're looking for doesn't exist or has been moved.
            </p>
          </div>

          {/* Illustration */}
          <div className="py-8">
            <div className="w-64 h-64 mx-auto relative">
              <div className="absolute inset-0 bg-primary/10 rounded-full animate-pulse" />
              <div className="absolute inset-4 bg-primary/20 rounded-full animate-pulse delay-75" />
              <div className="absolute inset-8 bg-primary/30 rounded-full animate-pulse delay-150" />
            </div>
          </div>

          {/* Back to Home Button */}
          <Link 
            href="/"
            className="inline-flex items-center gap-2 bg-primary text-secondary px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Icon name={ICONS.previous} className="w-5 h-5" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
} 