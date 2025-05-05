'use client'

import React from 'react'
import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to console for debugging
    console.error('Global application error:', error)
  }, [error])

  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
          <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-xl overflow-hidden">
            <div className="p-6">
              <div className="flex justify-center mb-6">
                <svg
                  className="w-16 h-16 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-label="Error icon"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-center mb-4">Something went wrong</h1>
              <div className="bg-gray-900 p-4 rounded mb-6 overflow-auto max-h-48">
                <p className="text-red-400 font-mono text-sm whitespace-pre-wrap">
                  {error?.name}: {error?.message}
                  {error?.stack && (
                    <>
                      <br /><br />
                      Stack trace:<br />
                      {error.stack.split('\n').slice(1).join('\n')}
                    </>
                  )}
                </p>
              </div>
              <div className="text-center mb-6">
                <p className="text-gray-300 mb-4">
                  Try refreshing the page or click the button below to try again.
                </p>
                <button
                  type="button"
                  onClick={() => reset()}
                  className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
} 