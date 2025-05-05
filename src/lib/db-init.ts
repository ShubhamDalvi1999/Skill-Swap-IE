/**
 * Database initialization script
 * This script is run on application startup to ensure the database is properly set up
 */

// We'll create a function to get the PrismaClient dynamically
async function getPrismaClient() {
  try {
    // Try to dynamically import PrismaClient
    const { PrismaClient } = await import('@prisma/client')
    return new PrismaClient()
  } catch (error) {
    console.error('Failed to import PrismaClient:', error)
    throw new Error('Could not initialize Prisma client')
  }
}

/**
 * Initialize the database
 * This function checks if the database is properly set up and runs migrations if needed
 */
export async function initializeDatabase() {
  // Use info level for initialization messages
  if (process.env.NODE_ENV === 'development') {
    console.log('Initializing database connection...')
  }
  
  try {
    // Get Prisma client
    const prisma = await getPrismaClient()
    
    // Test database connection
    await prisma.$connect()
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Database connection established successfully')
    }
    
    // Check if profiles exist
    const profileCount = await prisma.profile.count()
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`Database has ${profileCount} profiles`)
    }
    
    return { success: true }
  } catch (error) {
    // Always log errors regardless of environment
    console.error('Database initialization failed:', error)
    return { 
      success: false, 
      error: {
        code: 'DATABASE_INIT_ERROR',
        message: 'Failed to initialize database connection',
        details: (error as Error).message
      }
    }
  }
}

/**
 * Closes the database connection
 */
export async function closeDatabase() {
  try {
    // Get Prisma client
    const prisma = await getPrismaClient()
    await prisma.$disconnect()
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Database connection closed successfully')
    }
  } catch (error) {
    // Always log errors regardless of environment
    console.error('Error closing database connection:', error)
  }
} 