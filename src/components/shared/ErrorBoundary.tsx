// @ts-nocheck
'use client'

import React, { Component, type ReactNode, Suspense, useState, useEffect } from 'react'

// Create a simple error boundary component using standard React class
// This avoids the potential issues with createSafeClass and dynamic imports
class SimpleErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="p-6 rounded-xl bg-red-500/10 border border-red-600 text-center">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 bg-red-500 rounded-full flex items-center justify-center text-white">
              ⚠️
            </div>
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

// Export the simpler implementation directly
export default SimpleErrorBoundary 