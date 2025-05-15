'use client'

import { useState } from 'react'
import CourseCard from '@/components/features/CourseCard'
import CourseList from '@/components/features/CourseList'
import InviteFriend from '@/components/features/InviteFriend'
import UpcomingEvents from '@/components/features/UpcomingEvents'
import { Course, UserCourse } from '@/types/course'

// Temporary placeholder data that matches our database schema
const PLACEHOLDER_COURSES: Course[] = [
  {
    id: 'course-gen-ai',
    title: 'Gen AI',
    description: 'Learn the fundamentals of Generative AI and how to build applications with it.',
    instructor: 'user-demo-1',
    category: 'AI',
    level: 'intermediate',
    rating: 4.8,
    students_count: 1250,
    duration: 28,
    published_date: '2023-01-15',
    thumbnail: '/images/courses/gen-ai.jpg',
    price: 49.99
  },
  {
    id: 'course-react-mastery',
    title: 'React Mastery',
    description: 'Master React and build modern web applications with best practices.',
    instructor: 'user-demo-1',
    category: 'Web Development',
    level: 'advanced',
    rating: 4.9,
    students_count: 2340,
    duration: 42,
    published_date: '2023-02-20',
    thumbnail: '/images/courses/react.jpg',
    price: 59.99
  },
  {
    id: 'course-python-basics',
    title: 'Python Foundations',
    description: 'Build a solid foundation in Python programming for data science and automation.',
    instructor: 'user-demo-2',
    category: 'Programming',
    level: 'beginner',
    rating: 4.7,
    students_count: 3150,
    duration: 35,
    published_date: '2023-03-10',
    thumbnail: '/images/courses/python.jpg',
    price: 39.99
  },
  {
    id: 'course-web-design',
    title: 'UI/UX Design Essentials',
    description: 'Learn essential UI/UX design principles to create beautiful, user-friendly interfaces.',
    instructor: 'user-demo-3',
    category: 'Design',
    level: 'intermediate',
    rating: 4.6,
    students_count: 1842,
    duration: 30,
    published_date: '2023-04-05',
    thumbnail: '/images/courses/design.jpg',
    price: 54.99
  }
]

const PLACEHOLDER_USER_COURSES: UserCourse[] = [
  {
    ...PLACEHOLDER_COURSES[0],
    progress: 38,
    lastAccessed: new Date(),
    status: 'in-progress',
    enrolled_date: '2023-03-10'
  }
]

// Instructor data
const POPULAR_INSTRUCTORS = [
  {
    id: 'instructor-1',
    name: 'Sarah Johnson',
    specialization: 'Web Development',
    rating: 4.9,
    students: 15420,
    courses: 8,
    profileImage: '/images/instructors/instructor-1.jpg',
  },
  {
    id: 'instructor-2',
    name: 'David Chen',
    specialization: 'Data Science & AI',
    rating: 4.8,
    students: 12350,
    courses: 6,
    profileImage: '/images/instructors/instructor-2.jpg',
  },
  {
    id: 'instructor-3',
    name: 'Michelle Rodriguez',
    specialization: 'UI/UX Design',
    rating: 4.7,
    students: 9840,
    courses: 5,
    profileImage: '/images/instructors/instructor-3.jpg',
  },
  {
    id: 'instructor-4',
    name: 'James Wilson',
    specialization: 'Mobile Development',
    rating: 4.9,
    students: 11280,
    courses: 7,
    profileImage: '/images/instructors/instructor-4.jpg',
  },
  {
    id: 'instructor-5',
    name: 'Emily Zhang',
    specialization: 'Cloud Computing',
    rating: 4.8,
    students: 8760,
    courses: 4,
    profileImage: '/images/instructors/instructor-5.jpg',
  }
]

// Topics for filter
const TOPICS = [
  'Web Development',
  'Data Science',
  'Mobile Development',
  'Machine Learning',
  'Design',
  'Game Development',
  'DevOps',
  'Databases',
  'Programming Languages',
  'Cloud Computing'
]

export default function DashboardPage() {
  // State for carousel tabs
  const [activeCarouselTab, setActiveCarouselTab] = useState<'popular' | 'new' | 'trending'>('popular')
  
  // State for filters
  const [filters, setFilters] = useState({
    entityType: {
      courses: true,
      instructors: false
    },
    difficultyLevel: {
      beginner: false,
      intermediate: false,
      advanced: false
    },
    minimumRating: 0,
    topics: {} as Record<string, boolean>,
    level: {
      foundation: false,
      professional: false
    }
  })

  // Filter panel toggle for mobile
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false)
  
  // Function to toggle filter panel on mobile
  const toggleFilterPanel = () => {
    setIsFilterPanelOpen(!isFilterPanelOpen)
  }

  // Function to update entity type filter
  const handleEntityTypeChange = (type: 'courses' | 'instructors') => {
    setFilters({
      ...filters,
      entityType: {
        ...filters.entityType,
        [type]: !filters.entityType[type]
      }
    })
  }

  // Function to update difficulty level filter
  const handleDifficultyChange = (level: 'beginner' | 'intermediate' | 'advanced') => {
    setFilters({
      ...filters,
      difficultyLevel: {
        ...filters.difficultyLevel,
        [level]: !filters.difficultyLevel[level]
      }
    })
  }

  // Function to update rating filter
  const handleRatingChange = (rating: number) => {
    setFilters({
      ...filters,
      minimumRating: rating
    })
  }

  // Function to update topic filter
  const handleTopicChange = (topic: string) => {
    setFilters({
      ...filters,
      topics: {
        ...filters.topics,
        [topic]: !filters.topics[topic]
      }
    })
  }

  // Function to clear all filters
  const clearAllFilters = () => {
    setFilters({
      entityType: {
        courses: true,
        instructors: false
      },
      difficultyLevel: {
        beginner: false,
        intermediate: false,
        advanced: false
      },
      minimumRating: 0,
      topics: {},
      level: {
        foundation: false,
        professional: false
      }
    })
  }

  // Helper to get active filters count
  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.entityType.courses) count++
    if (filters.entityType.instructors) count++
    if (filters.difficultyLevel.beginner) count++
    if (filters.difficultyLevel.intermediate) count++
    if (filters.difficultyLevel.advanced) count++
    if (filters.minimumRating > 0) count++
    count += Object.values(filters.topics).filter(Boolean).length
    if (filters.level.foundation) count++
    if (filters.level.professional) count++
    return count
  }

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Top Welcome Section */}
      <header className="text-center py-6">
        <h1 className="text-3xl font-bold mb-2">Explore Learning Resources</h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Discover courses, instructors, and resources to advance your skills and knowledge
        </p>
      </header>

      {/* 1. Carousel for Popular Courses with Tabs */}
      <section className="bg-secondary rounded-xl p-6 border border-gray-800">
        <div className="flex justify-center mb-6">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              onClick={() => setActiveCarouselTab('popular')}
              className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                activeCarouselTab === 'popular'
                  ? 'bg-primary text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              Popular
            </button>
            <button
              type="button"
              onClick={() => setActiveCarouselTab('new')}
              className={`px-4 py-2 text-sm font-medium ${
                activeCarouselTab === 'new'
                  ? 'bg-primary text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              New
            </button>
            <button
              type="button"
              onClick={() => setActiveCarouselTab('trending')}
              className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                activeCarouselTab === 'trending'
                  ? 'bg-primary text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              Trending
            </button>
          </div>
        </div>

        {/* Course Carousel */}
        <div className="relative overflow-hidden">
          <div className="flex space-x-6 overflow-x-auto pb-4 snap-x">
            {PLACEHOLDER_COURSES.map(course => (
              <div key={course.id} className="snap-start flex-shrink-0 w-full sm:w-80 md:w-96">
                <CourseCard course={course} showProgress={false} />
              </div>
            ))}
          </div>
          
          {/* Carousel Controls */}
          <div className="flex justify-center space-x-2 mt-4">
            <button className="w-3 h-3 rounded-full bg-primary"></button>
            <button className="w-3 h-3 rounded-full bg-gray-600"></button>
            <button className="w-3 h-3 rounded-full bg-gray-600"></button>
          </div>
        </div>
      </section>

      {/* 2. Popular Instructors Section */}
      <section className="bg-secondary rounded-xl p-6 border border-gray-800">
        <h2 className="text-2xl font-bold mb-6">Popular Instructors</h2>
        
        <div className="overflow-hidden">
          <div className="flex space-x-6 overflow-x-auto pb-4">
            {POPULAR_INSTRUCTORS.map(instructor => (
              <div key={instructor.id} className="flex-shrink-0 w-60">
                <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-primary/50 transition-colors">
                  <div className="h-40 bg-gray-700 flex items-center justify-center">
                    {/* Placeholder for instructor image */}
                    <div className="w-24 h-24 rounded-full bg-gray-600 flex items-center justify-center text-2xl">
                      {instructor.name.charAt(0)}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg">{instructor.name}</h3>
                    <p className="text-sm text-gray-400">{instructor.specialization}</p>
                    <div className="flex items-center mt-2">
                      <span className="text-yellow-400 mr-1">★</span>
                      <span>{instructor.rating}</span>
                      <span className="mx-2">•</span>
                      <span>{instructor.courses} courses</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Course Listing with Filters Section */}
      <section className="flex flex-col md:flex-row gap-6">
        {/* Mobile Filter Toggle */}
        <div className="md:hidden mb-4">
          <button
            onClick={toggleFilterPanel}
            className="w-full flex items-center justify-between p-3 bg-secondary rounded-lg border border-gray-800"
          >
            <span className="font-medium">Filters {getActiveFiltersCount() > 0 && `(${getActiveFiltersCount()})`}</span>
            <svg
              className={`w-5 h-5 transition-transform ${isFilterPanelOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
        </div>

        {/* Left Filter Panel */}
        <div 
          className={`${
            isFilterPanelOpen ? 'block' : 'hidden'
          } md:block w-full md:w-64 space-y-6 bg-secondary p-4 rounded-xl border border-gray-800 h-fit`}
        >
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Filters</h3>
            <button 
              onClick={clearAllFilters}
              className="text-sm text-primary hover:text-primary-400"
            >
              Clear All
            </button>
          </div>

          {/* Entity Filter */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-300">Browse by Type</h4>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.entityType.courses}
                  onChange={() => handleEntityTypeChange('courses')}
                  className="w-4 h-4 text-primary bg-gray-700 border-gray-600 rounded focus:ring-primary focus:ring-2"
                />
                <span>Courses</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.entityType.instructors}
                  onChange={() => handleEntityTypeChange('instructors')}
                  className="w-4 h-4 text-primary bg-gray-700 border-gray-600 rounded focus:ring-primary focus:ring-2"
                />
                <span>Instructors</span>
              </label>
            </div>
          </div>

          {/* Difficulty Level */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-300">Difficulty Level</h4>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.difficultyLevel.beginner}
                  onChange={() => handleDifficultyChange('beginner')}
                  className="w-4 h-4 text-primary bg-gray-700 border-gray-600 rounded focus:ring-primary focus:ring-2"
                />
                <span>Beginner</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.difficultyLevel.intermediate}
                  onChange={() => handleDifficultyChange('intermediate')}
                  className="w-4 h-4 text-primary bg-gray-700 border-gray-600 rounded focus:ring-primary focus:ring-2"
                />
                <span>Intermediate</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.difficultyLevel.advanced}
                  onChange={() => handleDifficultyChange('advanced')}
                  className="w-4 h-4 text-primary bg-gray-700 border-gray-600 rounded focus:ring-primary focus:ring-2"
                />
                <span>Advanced</span>
              </label>
            </div>
          </div>

          {/* Rating */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-300">Minimum Rating</h4>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map(rating => (
                <label key={`rating-${rating}`} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="rating"
                    checked={filters.minimumRating === rating}
                    onChange={() => handleRatingChange(rating)}
                    className="w-4 h-4 text-primary bg-gray-700 border-gray-600 focus:ring-primary focus:ring-2"
                  />
                  <span className="flex items-center">
                    {Array.from({ length: rating }).map((_, i) => (
                      <span key={i} className="text-yellow-400">★</span>
                    ))}
                    {Array.from({ length: 5 - rating }).map((_, i) => (
                      <span key={i} className="text-gray-600">★</span>
                    ))}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Topics */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-300">Topics</h4>
            <div className="max-h-48 overflow-y-auto pr-2 space-y-2">
              {TOPICS.map(topic => (
                <label key={topic} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={!!filters.topics[topic]}
                    onChange={() => handleTopicChange(topic)}
                    className="w-4 h-4 text-primary bg-gray-700 border-gray-600 rounded focus:ring-primary focus:ring-2"
                  />
                  <span>{topic}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Level */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-300">Level</h4>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.level.foundation}
                  onChange={() => setFilters({
                    ...filters,
                    level: { ...filters.level, foundation: !filters.level.foundation }
                  })}
                  className="w-4 h-4 text-primary bg-gray-700 border-gray-600 rounded focus:ring-primary focus:ring-2"
                />
                <span>Foundation</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.level.professional}
                  onChange={() => setFilters({
                    ...filters,
                    level: { ...filters.level, professional: !filters.level.professional }
                  })}
                  className="w-4 h-4 text-primary bg-gray-700 border-gray-600 rounded focus:ring-primary focus:ring-2"
                />
                <span>Professional</span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Content Panel */}
        <div className="flex-1">
          {/* Active Filters */}
          {getActiveFiltersCount() > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {filters.entityType.courses && (
                <span className="bg-gray-700 text-gray-200 px-3 py-1 rounded-full text-sm flex items-center">
                  Courses
                  <button 
                    onClick={() => handleEntityTypeChange('courses')}
                    className="ml-1 text-gray-400 hover:text-white"
                  >
                    ×
                  </button>
                </span>
              )}
              {filters.entityType.instructors && (
                <span className="bg-gray-700 text-gray-200 px-3 py-1 rounded-full text-sm flex items-center">
                  Instructors
                  <button 
                    onClick={() => handleEntityTypeChange('instructors')}
                    className="ml-1 text-gray-400 hover:text-white"
                  >
                    ×
                  </button>
                </span>
              )}
              {/* Add other active filters here */}
            </div>
          )}

          {/* Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PLACEHOLDER_COURSES.map(course => (
              <CourseCard
                key={course.id}
                course={course}
                showProgress={false}
              />
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-8 flex justify-center">
            <nav className="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <a
                href="#"
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-700 bg-gray-800 text-sm font-medium text-gray-400 hover:bg-gray-700"
              >
                <span className="sr-only">Previous</span>
                &laquo;
              </a>
              <a
                href="#"
                aria-current="page"
                className="relative inline-flex items-center px-4 py-2 border border-gray-700 bg-gray-900 text-sm font-medium text-primary hover:bg-gray-800"
              >
                1
              </a>
              <a
                href="#"
                className="relative inline-flex items-center px-4 py-2 border border-gray-700 bg-gray-800 text-sm font-medium text-gray-400 hover:bg-gray-700"
              >
                2
              </a>
              <a
                href="#"
                className="relative inline-flex items-center px-4 py-2 border border-gray-700 bg-gray-800 text-sm font-medium text-gray-400 hover:bg-gray-700"
              >
                3
              </a>
              <a
                href="#"
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-700 bg-gray-800 text-sm font-medium text-gray-400 hover:bg-gray-700"
              >
                <span className="sr-only">Next</span>
                &raquo;
              </a>
            </nav>
          </div>
          </div>
        </section>

      {/* Upcoming Events Section (moved to bottom) */}
      <section className="bg-secondary rounded-xl p-6 border border-gray-800">
        <UpcomingEvents />
      </section>
    </div>
  )
} 