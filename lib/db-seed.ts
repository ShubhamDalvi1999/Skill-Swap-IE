import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Seeds the database with initial data
 */
export async function seedDatabase() {
  console.log('Seeding database with initial data...');
  
  try {
    // Create sample users
    const user1 = await prisma.user.upsert({
      where: { email: 'demo@example.com' },
      update: {},
      create: {
        email: 'demo@example.com',
        name: 'Demo User',
      },
    });

    console.log(`Created user: ${user1.name}`);

    // Create sample courses
    const course1 = await prisma.course.upsert({
      where: { id: 'course-gen-ai' },
      update: {},
      create: {
        id: 'course-gen-ai',
        title: 'Gen AI',
        description: 'Learn the fundamentals of Generative AI and how to build applications with it.',
        imageUrl: '/images/courses/gen-ai.jpg',
        duration: '4 weeks',
        instructorId: user1.id,
        totalStudents: 1250,
        rating: 4.8,
        category: 'AI',
        level: 'Intermediate',
        tags: ['AI', 'Machine Learning', 'Python'],
      },
    });

    const course2 = await prisma.course.upsert({
      where: { id: 'course-react-mastery' },
      update: {},
      create: {
        id: 'course-react-mastery',
        title: 'React Mastery',
        description: 'Master React and build modern web applications with best practices.',
        imageUrl: '/images/courses/react.jpg',
        duration: '6 weeks',
        instructorId: user1.id,
        totalStudents: 2340,
        rating: 4.9,
        category: 'Web Development',
        level: 'Advanced',
        tags: ['React', 'JavaScript', 'Frontend'],
      },
    });

    console.log(`Created courses: ${course1.title}, ${course2.title}`);

    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Allow running directly from command line
if (require.main === module) {
  seedDatabase()
    .then(() => console.log('Seeding complete'))
    .catch((e) => {
      console.error('Error during seeding:', e);
      process.exit(1);
    });
} 