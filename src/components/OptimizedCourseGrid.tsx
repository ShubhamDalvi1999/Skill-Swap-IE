'use client'

import { useState, useEffect, ChangeEvent } from 'react'
import { usePerformance } from '@/hooks/usePerformance'
import { useErrorToast } from '@/hooks/useErrorToast'
import { ErrorHandler } from '@/lib/errors/errorHandler'

interface Course {
  id: string
  title: string
  description: string
  thumbnail: string
  category: string
  level: 'beginner' | 'intermediate' | 'advanced'
  rating: number
}

/**
 * A performance-optimized grid display of course cards
 */
export default function OptimizedCourseGrid({ initialCourses = [] }: { initialCourses?: Course[] }) {
  const [courses, setCourses] = useState<Course[]>(initialCourses)
  const [filters, setFilters] = useState({ 
    category: '', 
    level: '', 
    searchQuery: '',
    sortBy: 'newest'
  })
  const [loading, setLoading] = useState(false)
  
  const { showApiError } = useErrorToast()
  const { 
    createDebouncedFunction, 
    createMemoizedFunction,
    optimizeCalculation,
    preload,
    scheduleLowPriorityUpdate,
    trackRender
  } = usePerformance()
  
  // Performance tracking for development
  const endTracking = trackRender('OptimizedCourseGrid')
  
  // Debounce search to prevent too many filter operations
  const debouncedSearch = createDebouncedFunction((query: string) => {
    setFilters(prev => ({ ...prev, searchQuery: query }))
  }, 400)
  
  // Memoized filter function
  const filterCourses = optimizeCalculation((
    courseList: Course[], 
    filterSettings: typeof filters
  ): Course[] => {
    console.log('Filtering courses with settings:', filterSettings)
    
    return courseList.filter(course => {
      // Apply category filter
      if (filterSettings.category && course.category !== filterSettings.category) {
        return false
      }
      
      // Apply level filter
      if (filterSettings.level && course.level !== filterSettings.level) {
        return false
      }
      
      // Apply search query filter
      if (filterSettings.searchQuery) {
        const query = filterSettings.searchQuery.toLowerCase()
        return (
          course.title.toLowerCase().includes(query) || 
          course.description.toLowerCase().includes(query)
        )
      }
      
      return true
    }).sort((a, b) => {
      // Apply sorting
      switch (filterSettings.sortBy) {
        case 'rating':
          return b.rating - a.rating
        case 'newest':
          // In a real app, we would sort by date
          return 0
        default:
          return 0
      }
    })
  }, [filters])
  
  // Get filtered courses
  const filteredCourses = filterCourses(courses, filters)
  
  // Handle search input change
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value)
  }
  
  // Handle filter changes
  const handleFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target
    setFilters(prev => ({ ...prev, [name]: value }))
  }
  
  // Fetch courses from API
  const fetchCourses = async () => {
    setLoading(true)
    try {
      // Simulate API call
      const response = await fetch('/api/courses')
      if (!response.ok) {
        throw new Error('Failed to fetch courses')
      }
      
      const data = await response.json()
      setCourses(data)
      
      // Preload thumbnail images
      const imageUrls = data.map((course: Course) => course.thumbnail)
      preload(imageUrls)
    } catch (error) {
      const handledError = ErrorHandler.handleApiError(error, 'Failed to fetch courses')
      showApiError(handledError, 'course retrieval')
    } finally {
      setLoading(false)
    }
  }
  
  // Fetch courses on initial load
  useEffect(() => {
    if (initialCourses.length === 0) {
      fetchCourses()
    } else {
      // Preload thumbnail images for initial courses
      const imageUrls = initialCourses.map(course => course.thumbnail)
      scheduleLowPriorityUpdate(() => preload(imageUrls))
    }
  }, [initialCourses.length])
  
  // Stop performance tracking
  useEffect(() => {
    return endTracking
  }, [])
  
  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search courses..."
          className="p-2 border rounded w-full md:w-1/3"
          onChange={handleSearchChange}
        />
        
        <select
          name="category"
          className="p-2 border rounded"
          onChange={handleFilterChange}
          value={filters.category}
        >
          <option value="">All Categories</option>
          <option value="programming">Programming</option>
          <option value="design">Design</option>
          <option value="business">Business</option>
        </select>
        
        <select
          name="level"
          className="p-2 border rounded"
          onChange={handleFilterChange}
          value={filters.level}
        >
          <option value="">All Levels</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
        
        <select
          name="sortBy"
          className="p-2 border rounded"
          onChange={handleFilterChange}
          value={filters.sortBy}
        >
          <option value="newest">Newest</option>
          <option value="rating">Highest Rated</option>
        </select>
      </div>
      
      {loading ? (
        <div className="text-center py-8">Loading courses...</div>
      ) : filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          No courses found matching your filters.
        </div>
      )}
    </div>
  )
}

function CourseCard({ course }: { course: Course }) {
  return (
    <div className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      <div className="aspect-video bg-gray-200 relative">
        <img 
          src={course.thumbnail} 
          alt={course.title}
          className="object-cover w-full h-full"
          loading="lazy" // Built-in lazy loading for better performance
        />
        <span className={`absolute top-2 right-2 px-2 py-1 text-xs text-white rounded ${
          course.level === 'beginner' ? 'bg-green-500' :
          course.level === 'intermediate' ? 'bg-blue-500' : 'bg-purple-500'
        }`}>
          {course.level}
        </span>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-bold mb-1 truncate">{course.title}</h3>
        <p className="text-gray-600 text-sm mb-2 line-clamp-2">{course.description}</p>
        
        <div className="flex justify-between items-center">
          <span className="bg-gray-100 px-2 py-1 rounded text-xs">
            {course.category}
          </span>
          <div className="flex items-center">
            <span className="text-yellow-500 mr-1">★</span>
            <span className="text-sm">{course.rating.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </div>
  )
} 