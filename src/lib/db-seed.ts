// @ts-nocheck
import { AppError } from './errors/AppError';

// Function to get PrismaClient dynamically
async function getPrismaClient() {
  try {
    const { PrismaClient } = await import('@prisma/client');
    return new PrismaClient();
  } catch (error) {
    console.error('Failed to import PrismaClient:', error);
    throw new Error('Could not initialize Prisma client for seeding');
  }
}

/**
 * Seeds the database with initial data for development and testing
 */
export async function seedDatabase() {
  let prisma;
  
  try {
    console.log('Starting database seeding...');
    
    // Get Prisma client
    prisma = await getPrismaClient();
    
    // Check if data already exists to avoid duplicate seeding
    const existingCourses = await prisma.course.count();
    if (existingCourses > 0) {
      console.log('Database already contains data, skipping seed operation');
      return;
    }

    // Create sample tags
    const tags = await prisma.courseTag.createMany({
      data: [
        { name: 'JavaScript', slug: 'javascript' },
        { name: 'React', slug: 'react' },
        { name: 'Node.js', slug: 'nodejs' },
        { name: 'TypeScript', slug: 'typescript' },
        { name: 'CSS', slug: 'css' },
        { name: 'HTML', slug: 'html' },
      ],
      skipDuplicates: true,
    });
    console.log(`Created ${tags.count} course tags`);

    // Create sample profiles
    const instructor = await prisma.profile.create({
      data: {
        id: 'instructor-1',
        fullName: 'John Instructor',
        email: 'instructor@example.com',
        avatarUrl: 'https://randomuser.me/api/portraits/men/1.jpg',
        bio: 'Experienced web developer with 10+ years in the industry',
        joinedDate: new Date(),
        lastSeen: new Date(),
      },
    });
    
    const student = await prisma.profile.create({
      data: {
        id: 'student-1',
        fullName: 'Sarah Student',
        email: 'student@example.com',
        avatarUrl: 'https://randomuser.me/api/portraits/women/1.jpg',
        bio: 'Aspiring web developer',
        joinedDate: new Date(),
        lastSeen: new Date(),
      },
    });
    console.log('Created sample profiles');

    // Create a sample course
    const course = await prisma.course.create({
      data: {
        title: 'Modern Web Development with React',
        slug: 'modern-web-development-react',
        description: 'Learn how to build modern web applications using React and related technologies',
        price: 49.99,
        level: 'INTERMEDIATE',
        thumbnailUrl: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2',
        durationHours: 12,
        studentsCount: 0,
        publishedDate: new Date(),
        isPublished: true,
        isFeatured: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: instructor.id,
      },
    });
    console.log('Created sample course');

    // Create course metadata
    await prisma.courseMetadata.create({
      data: {
        courseId: course.id,
        learningObjectives: JSON.stringify([
          'Build React applications from scratch',
          'Understand React hooks and state management',
          'Create responsive UIs with modern CSS',
        ]),
        targetAudience: JSON.stringify([
          'Web developers looking to learn React',
          'JavaScript developers wanting to expand their skills',
          'Beginners with basic HTML, CSS, and JavaScript knowledge',
        ]),
        prerequisites: 'Basic knowledge of HTML, CSS, and JavaScript',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    console.log('Created course metadata');

    // Connect tags to course
    const tagIds = await prisma.courseTag.findMany({
      where: {
        slug: {
          in: ['react', 'javascript', 'css'],
        },
      },
      select: {
        id: true,
      },
    });

    await Promise.all(
      tagIds.map((tag: { id: string }) =>
        prisma.courseTagMapping.create({
          data: {
            courseId: course.id,
            tagId: tag.id,
          },
        })
      )
    );
    console.log('Connected tags to course');

    // Create course modules
    const module1 = await prisma.courseModule.create({
      data: {
        title: 'Getting Started with React',
        description: 'Learn the basics of React and set up your development environment',
        courseId: course.id,
        orderIndex: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    const module2 = await prisma.courseModule.create({
      data: {
        title: 'React Components and Props',
        description: 'Learn how to create and use React components',
        courseId: course.id,
        orderIndex: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    console.log('Created course modules');

    // Create lessons for module 1
    await prisma.courseLesson.createMany({
      data: [
        {
          title: 'Introduction to React',
          description: 'Overview of React and its core concepts',
          content: 'React is a JavaScript library for building user interfaces...',
          moduleId: module1.id,
          courseId: course.id,
          durationMinutes: 15,
          videoUrl: 'https://example.com/videos/intro-to-react',
          isFree: true,
          orderIndex: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: 'Setting Up Your Development Environment',
          description: 'Install and configure the tools needed for React development',
          content: 'In this lesson, we will set up Node.js, npm, and create a new React app...',
          moduleId: module1.id,
          courseId: course.id,
          durationMinutes: 20,
          videoUrl: 'https://example.com/videos/react-setup',
          isFree: false,
          orderIndex: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    });

    // Create lessons for module 2
    await prisma.courseLesson.createMany({
      data: [
        {
          title: 'Creating Your First Component',
          description: 'Learn how to create and use React components',
          content: 'Components are the building blocks of React applications...',
          moduleId: module2.id,
          courseId: course.id,
          durationMinutes: 25,
          videoUrl: 'https://example.com/videos/first-component',
          isFree: false,
          orderIndex: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: 'Working with Props',
          description: 'Learn how to pass data between components using props',
          content: 'Props are used to pass data from parent to child components...',
          moduleId: module2.id,
          courseId: course.id,
          durationMinutes: 30,
          videoUrl: 'https://example.com/videos/react-props',
          isFree: false,
          orderIndex: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    });
    console.log('Created course lessons');

    // Create course resources
    await prisma.courseResource.createMany({
      data: [
        {
          title: 'React Cheat Sheet',
          description: 'A quick reference guide for React concepts',
          type: 'PDF',
          url: 'https://example.com/resources/react-cheatsheet.pdf',
          courseId: course.id,
          createdAt: new Date(),
        },
        {
          title: 'Component Examples',
          description: 'Example code for various React components',
          type: 'CODE',
          url: 'https://github.com/example/react-components',
          courseId: course.id,
          createdAt: new Date(),
        },
      ],
    });
    console.log('Created course resources');

    // Create a course enrollment
    await prisma.courseEnrollment.create({
      data: {
        userId: student.id,
        courseId: course.id,
        enrollmentDate: new Date(),
        lastAccessedAt: new Date(),
        paymentMethod: 'CREDIT_CARD',
        status: 'ACTIVE',
      },
    });
    console.log('Created course enrollment');

    // Create a course review
    await prisma.courseReview.create({
      data: {
        userId: student.id,
        courseId: course.id,
        rating: 5,
        comment: 'Excellent course! I learned a lot about React and modern web development.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    console.log('Created course review');

    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw new AppError('Failed to seed database', {
      code: 'DATABASE_SEED_ERROR',
      cause: error as Error,
      context: { operation: 'database_seeding' }
    });
  } finally {
    if (prisma) {
      await prisma.$disconnect();
    }
  }
} 