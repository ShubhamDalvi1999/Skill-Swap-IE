// @ts-nocheck
'use client'

import React, { Component, type ReactNode, Suspense } from 'react'
import { createSafeClass } from '@/utils/dynamicImport'

// Instead of importing ICONS directly which could cause circular dependencies,
// create a constant for the warning icon
const WARNING_ICON = "AlertTriangle";

// Import Icon component lazily to avoid potential circular dependencies
const IconComponent = React.lazy(() => import('@/components/ui/Icon'))

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error | null
}

interface ErrorInfo {
  componentStack: string
}

// Create a IconFallback component to avoid the need for IconComponent during initial load
const IconFallback = () => (
  <div className="h-12 w-12 bg-red-500/20 rounded-full animate-pulse" />
);

// Use createSafeClass to safely extend React.Component
const ErrorBoundaryClass = createSafeClass(
  Component,
  (Base) => 
    class ErrorBoundaryImpl extends Base<ErrorBoundaryProps, ErrorBoundaryState> {
      constructor(props: ErrorBoundaryProps) {
        super(props)
        this.state = { hasError: false, error: null }
      }

      static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error }
      }

      componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        // Log the error to an error reporting service
        console.error('Error caught by ErrorBoundary:', error, errorInfo)
      }

      render() {
        if (this.state.hasError) {
          // You can render any custom fallback UI
          if (this.props.fallback) {
            return this.props.fallback
          }

          return (
            <div className="p-6 rounded-xl bg-red-500/10 border border-red-600 text-center">
              <div className="flex justify-center mb-4">
                <Suspense fallback={<IconFallback />}>
                  <IconComponent name={WARNING_ICON} className="h-12 w-12 text-red-500" />
                </Suspense>
              </div>
              <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
              <p className="text-gray-400 mb-4">
                An error occurred while rendering this component.
              </p>
              <div className="bg-black/30 p-4 rounded mb-4 text-left overflow-auto max-h-40">
                <pre className="text-sm text-red-400">
                  {this.state.error?.toString() || 'Unknown error'}
                </pre>
              </div>
              <button
                type="button"
                onClick={() => this.setState({ hasError: false, error: null })}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Try again
              </button>
            </div>
          )
        }

        return this.props.children
      }
    }
)

const ErrorBoundary = ErrorBoundaryClass;
export default ErrorBoundary 