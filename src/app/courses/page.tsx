import MainLayout from '@/components/layout/MainLayout'
import CourseCard from '@/components/features/CourseCard'
import { Course } from '@/types'

// Mock data - In a real app, this would come from an API
const courses: Course[] = [
  {
    id: '1',
    title: 'Web Development Fundamentals',
    description: 'Learn the basics of web development with HTML, CSS, and JavaScript.',
    imageUrl: 'https://picsum.photos/800/600?random=1',
    duration: '8 weeks',
    students: 1234,
  },
  {
    id: '2',
    title: 'React.js Mastery',
    description: 'Master React.js and build modern web applications.',
    imageUrl: 'https://picsum.photos/800/600?random=2',
    duration: '10 weeks',
    students: 856,
  },
  {
    id: '3',
    title: 'Full Stack Development',
    description: 'Become a full stack developer with Node.js and React.',
    imageUrl: 'https://picsum.photos/800/600?random=3',
    duration: '12 weeks',
    students: 2341,
  },
  {
    id: '4',
    title: 'UI/UX Design Fundamentals',
    description: 'Learn the principles of user interface and experience design.',
    imageUrl: 'https://picsum.photos/800/600?random=4',
    duration: '6 weeks',
    students: 1567,
  },
  {
    id: '5',
    title: 'Python Programming',
    description: 'Learn Python programming from basics to advanced concepts.',
    imageUrl: 'https://picsum.photos/800/600?random=5',
    duration: '10 weeks',
    students: 3421,
  },
  {
    id: '6',
    title: 'Mobile App Development',
    description: 'Build cross-platform mobile apps with React Native.',
    imageUrl: 'https://picsum.photos/800/600?random=6',
    duration: '12 weeks',
    students: 1234,
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
          <CourseCard key={course.id} {...course} />
        ))}
      </div>
    </MainLayout>
  )
} 