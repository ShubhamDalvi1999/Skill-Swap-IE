import MainLayout from '@/components/layout/MainLayout'
import CourseCard from '@/components/features/CourseCard'
import type { Course } from '@/types'

// Mock data - In a real app, this would come from an API
const courses: Course[] = [
  {
    id: '1',
    title: 'Web Development Fundamentals',
    description: 'Learn the basics of web development with HTML, CSS, and JavaScript.',
    instructor: 'John Doe',
    category: 'Web Development',
    level: 'beginner',
    rating: 4.8,
    students_count: 1234,
    duration: 56, // in days (8 weeks)
    published_date: '2023-01-15',
    thumbnail: 'https://picsum.photos/800/600?random=1',
    price: 49.99
  },
  {
    id: '2',
    title: 'React.js Mastery',
    description: 'Master React.js and build modern web applications.',
    instructor: 'Jane Smith',
    category: 'Frontend',
    level: 'intermediate',
    rating: 4.9,
    students_count: 856,
    duration: 70, // in days (10 weeks)
    published_date: '2023-02-10',
    thumbnail: 'https://picsum.photos/800/600?random=2',
    price: 59.99
  },
  {
    id: '3',
    title: 'Full Stack Development',
    description: 'Become a full stack developer with Node.js and React.',
    instructor: 'Robert Johnson',
    category: 'Full Stack',
    level: 'advanced',
    rating: 4.7,
    students_count: 2341,
    duration: 84, // in days (12 weeks)
    published_date: '2023-03-05',
    thumbnail: 'https://picsum.photos/800/600?random=3',
    price: 79.99
  },
  {
    id: '4',
    title: 'UI/UX Design Fundamentals',
    description: 'Learn the principles of user interface and experience design.',
    instructor: 'Sarah Williams',
    category: 'Design',
    level: 'beginner',
    rating: 4.6,
    students_count: 1567,
    duration: 42, // in days (6 weeks)
    published_date: '2023-04-20',
    thumbnail: 'https://picsum.photos/800/600?random=4',
    price: 39.99
  },
  {
    id: '5',
    title: 'Python Programming',
    description: 'Learn Python programming from basics to advanced concepts.',
    instructor: 'Michael Brown',
    category: 'Programming',
    level: 'intermediate',
    rating: 4.8,
    students_count: 3421,
    duration: 70, // in days (10 weeks)
    published_date: '2023-05-15',
    thumbnail: 'https://picsum.photos/800/600?random=5',
    price: 54.99
  },
  {
    id: '6',
    title: 'Mobile App Development',
    description: 'Build cross-platform mobile apps with React Native.',
    instructor: 'Lisa Anderson',
    category: 'Mobile',
    level: 'intermediate',
    rating: 4.7,
    students_count: 1234,
    duration: 84, // in days (12 weeks)
    published_date: '2023-06-10',
    thumbnail: 'https://picsum.photos/800/600?random=6',
    price: 64.99
  },
]

export default function CoursesPage() {
  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Available Courses</h1>
        <p className="text-gray-400">Explore our wide range of courses</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </MainLayout>
  )
} 