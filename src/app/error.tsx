'use client'

import React from 'react'
import { useEffect } from 'react'

export default function GlobalErrorHandler({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('App root error:', error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <div className="w-full max-w-md rounded-lg bg-red-500/10 p-8 shadow-lg border border-red-600">
        <h2 className="mb-4 text-2xl font-bold">Something went wrong</h2>
        <div className="mb-6 overflow-auto rounded bg-black/30 p-4 text-left max-h-60">
          <p className="text-red-400 font-mono text-sm whitespace-pre-wrap">
            {error?.message || 'An unexpected error occurred'}{'\n\n'}
            {error?.stack?.split('\n').slice(0, 5).join('\n')}
          </p>
        </div>
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-lg bg-primary px-6 py-2 text-white hover:bg-primary/90 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  )
} 