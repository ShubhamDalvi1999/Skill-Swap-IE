'use client'

import { useEffect, useState } from 'react'

/**
 * Component that initializes the database on application startup
 * This is a client component that runs the database initialization script
 */
export default function DatabaseInitializer() {
  const [initialized, setInitialized] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function initDb() {
      try {
        // Dynamically import the initialization function to avoid server/client mismatch
        const dbInit = await import('@/lib/db-init')
        const result = await dbInit.initializeDatabase()
        
        if (result.success) {
          console.log('Database initialized successfully')
          setInitialized(true)
        } else {
          console.error('Database initialization failed:', result.error)
          setError(result.error?.message || 'Database initialization failed')
        }
      } catch (err) {
        console.error('Error initializing database:', err)
        setError('Failed to initialize database')
      }
    }

    // Only run in development mode or on first load in production
    if (process.env.NODE_ENV === 'development' || !initialized) {
      initDb()
    }
  }, [initialized])

  // This component doesn't render anything visible
  return null
} 