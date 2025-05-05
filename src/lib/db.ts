import { PrismaClient } from '@prisma/client'

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
// Learn more: https://pris.ly/d/help/next-js-best-practices

const globalForPrisma = global as unknown as { prisma: PrismaClient }

// Type for mock database operations
type DbOperation = Record<string, unknown>

export function createPrismaClient(): PrismaClient {
  try {
    if (process.env.NODE_ENV === 'production') {
      // In production, create a new instance each time
      return new PrismaClient()
    }
    
    // In development, use a global variable to reuse connections
    if (!globalForPrisma.prisma) {
      globalForPrisma.prisma = new PrismaClient({
        log: ['query', 'error', 'warn'],
      })
    }
    return globalForPrisma.prisma
  } catch (error) {
    console.error('Error initializing Prisma client:', error)
    // Return a mock client when real connection fails
    // This allows the app to function even when the database is not available
    return getMockPrismaClient()
  }
}

function getMockPrismaClient(): PrismaClient {
  console.warn('Using mock Prisma client. Database features will be limited.')
  
  // This is a minimal mock implementation that prevents crashes
  return {
    $connect: () => Promise.resolve(),
    $disconnect: () => Promise.resolve(),
    $on: () => { return {} as Record<string, unknown> },
    $executeRaw: () => Promise.resolve(0),
    $queryRaw: () => Promise.resolve([]),
    $transaction: (fn: (prisma: unknown[]) => unknown) => Promise.resolve(fn([])),
    // Add mock implementations for models you use
    user: createMockModel(),
    course: createMockModel(),
    profile: createMockModel(),
    // Add other models as needed
  } as unknown as PrismaClient
}

function createMockModel() {
  return {
    findUnique: () => Promise.resolve(null),
    findFirst: () => Promise.resolve(null),
    findMany: () => Promise.resolve([]),
    create: (args: DbOperation) => Promise.resolve(args.data as DbOperation),
    update: (args: DbOperation) => Promise.resolve(args.data as DbOperation),
    upsert: (args: DbOperation) => Promise.resolve(args.create as DbOperation),
    delete: () => Promise.resolve({}),
    count: () => Promise.resolve(0),
  }
}

// Create a single instance and reuse it
let prismaInstance: PrismaClient | null = null

export function getPrismaClient(): PrismaClient {
  if (!prismaInstance) {
    prismaInstance = createPrismaClient()
  }
  return prismaInstance
}

// Export the client instance directly for convenience
const prisma = getPrismaClient()
export default prisma 