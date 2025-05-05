import { NextResponse } from 'next/server';

// Function to get PrismaClient dynamically
async function getPrismaClient() {
  try {
    const { PrismaClient } = await import('@prisma/client');
    return new PrismaClient();
  } catch (error) {
    console.error('Failed to import PrismaClient:', error);
    throw new Error('Could not initialize Prisma client');
  }
}

export async function GET() {
  try {
    const prisma = await getPrismaClient();
    
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    
    // Get database statistics
    const userCount = await prisma.profile.count();
    const courseCount = await prisma.course.count();
    const moduleCount = await prisma.courseModule.count();
    const lessonCount = await prisma.courseLesson.count();
    const enrollmentCount = await prisma.courseEnrollment.count();
    
    await prisma.$disconnect();
    
    return NextResponse.json({
      status: 'connected',
      statistics: {
        users: userCount,
        courses: courseCount,
        modules: moduleCount,
        lessons: lessonCount,
        enrollments: enrollmentCount,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Database connection error:', error);
    
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Failed to connect to database',
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
} 