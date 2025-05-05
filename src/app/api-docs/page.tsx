'use client'

import { useEffect, useState } from 'react'
import SwaggerUIComponent from '@/components/api/SwaggerUIComponent'

export default function ApiDocsPage() {
  const [spec, setSpec] = useState<Record<string, unknown> | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Fetch the Swagger specification
    fetch('/api/swagger')
      .then(response => response.json())
      .then(data => {
        setSpec(data)
        setIsLoading(false)
      })
      .catch(error => {
        console.error('Error loading Swagger spec:', error)
        setIsLoading(false)
      })
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-primary-500">Course Platform API Documentation</h1>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500" />
          </div>
        ) : spec ? (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <SwaggerUIComponent spec={spec} />
          </div>
        ) : (
          <div className="text-center py-12 text-error">
            <p className="text-xl">Failed to load API documentation</p>
            <p className="mt-2">Please try again later or contact support</p>
          </div>
        )}
      </div>
    </div>
  )
} 