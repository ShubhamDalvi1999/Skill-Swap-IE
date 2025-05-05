// @ts-nocheck
import { create } from 'zustand'
import { Course, CourseDetails, CourseSearchParams } from '@/types/course'
import { AppError } from '@/lib/errors/AppError'

interface CourseState {
  // Course listings
  courses: Course[]
  featuredCourses: Course[]
  popularCourses: Course[]
  newCourses: Course[]
  
  // Course search
  searchResults: Course[]
  searchParams: CourseSearchParams
  totalSearchResults: number
  searchPage: number
  
  // Details and status
  currentCourse: CourseDetails | null
  enrolledCourses: Course[]
  isLoading: boolean
  error: string | null
  
  // Actions
  fetchCourses: () => Promise<void>
  fetchFeaturedCourses: () => Promise<void>
  fetchPopularCourses: () => Promise<void>
  fetchNewCourses: () => Promise<void>
  fetchCourseDetails: (courseId: string) => Promise<CourseDetails | null>
  searchCourses: (params: CourseSearchParams) => Promise<void>
  loadMoreSearchResults: () => Promise<void>
  clearSearchResults: () => void
  fetchEnrolledCourses: () => Promise<void>
  enrollInCourse: (courseId: string) => Promise<boolean>
  clearError: () => void
}

// Mock API functions (replace with actual API calls)
const mockFetchCourses = async (): Promise<Course[]> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500))
  
  return Array(10).fill(null).map((_, index) => ({
    id: `course-${index + 1}`,
    title: `Sample Course ${index + 1}`,
    description: 'This is a sample course description.',
    instructor: 'Jane Doe',
    category: 'Development',
    level: index % 3 === 0 ? 'beginner' : index % 3 === 1 ? 'intermediate' : 'advanced',
    rating: 4.5,
    students_count: 100 + index * 10,
    duration: 10 + index,
    published_date: new Date().toISOString(),
    thumbnail: '/images/course-thumbnail.jpg',
    price: index % 3 === 0 ? 0 : 19.99 + index * 10,
  }))
}

export const useCourseStore = create<CourseState>()((set, get) => ({
  courses: [],
  featuredCourses: [],
  popularCourses: [],
  newCourses: [],
  searchResults: [],
  searchParams: {
    query: '',
    category: null,
    level: null,
    sortBy: 'newest'
  },
  totalSearchResults: 0,
  searchPage: 1,
  currentCourse: null,
  enrolledCourses: [],
  isLoading: false,
  error: null,

  fetchCourses: async () => {
    set({ isLoading: true })
    try {
      const courses = await mockFetchCourses()
      set({ 
        courses,
        isLoading: false 
      })
    } catch (error) {
      console.error('Failed to fetch courses:', error)
      set({ 
        error: AppError.from(error).message,
        isLoading: false 
      })
    }
  },

  fetchFeaturedCourses: async () => {
    set({ isLoading: true })
    try {
      const courses = await mockFetchCourses()
      // In a real app, you'd call a specific API endpoint for featured courses
      set({ 
        featuredCourses: courses.slice(0, 4),
        isLoading: false 
      })
    } catch (error) {
      console.error('Failed to fetch featured courses:', error)
      set({ 
        error: AppError.from(error).message,
        isLoading: false 
      })
    }
  },

  fetchPopularCourses: async () => {
    set({ isLoading: true })
    try {
      const courses = await mockFetchCourses()
      // In a real app, you'd call a specific API endpoint for popular courses
      set({ 
        popularCourses: courses
          .sort((a, b) => b.students_count - a.students_count)
          .slice(0, 5),
        isLoading: false 
      })
    } catch (error) {
      console.error('Failed to fetch popular courses:', error)
      set({ 
        error: AppError.from(error).message,
        isLoading: false 
      })
    }
  },

  fetchNewCourses: async () => {
    set({ isLoading: true })
    try {
      const courses = await mockFetchCourses()
      // In a real app, you'd call a specific API endpoint for new courses
      set({ 
        newCourses: courses
          .sort((a, b) => new Date(b.published_date).getTime() - new Date(a.published_date).getTime())
          .slice(0, 5),
        isLoading: false 
      })
    } catch (error) {
      console.error('Failed to fetch new courses:', error)
      set({ 
        error: AppError.from(error).message,
        isLoading: false 
      })
    }
  },

  fetchCourseDetails: async (courseId) => {
    set({ isLoading: true })
    try {
      // Simulate API call to get course details
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const courses = await mockFetchCourses()
      const course = courses.find(c => c.id === courseId)
      
      if (!course) {
        throw AppError.notFound(`Course with ID ${courseId} not found`)
      }
      
      // Additional details for course
      const courseDetails: CourseDetails = {
        ...course,
        syllabus: Array(5).fill(null).map((_, index) => ({
          id: `module-${index + 1}`,
          title: `Module ${index + 1}`,
          description: 'This is a module description.',
          duration: 2 + index,
          lessons: Array(3).fill(null).map((_, lessonIndex) => ({
            id: `lesson-${index}-${lessonIndex}`,
            title: `Lesson ${lessonIndex + 1}`,
            duration: 20 + lessonIndex * 5,
            videoUrl: 'https://example.com/video.mp4',
            completed: false
          }))
        })),
        resources: [
          { id: 'resource-1', title: 'Course Slides', type: 'pdf', url: '#' },
          { id: 'resource-2', title: 'Example Code', type: 'code', url: '#' }
        ],
        reviews: Array(5).fill(null).map((_, index) => ({
          id: `review-${index}`,
          user: `User ${index + 1}`,
          avatar: '/images/avatar.jpg',
          rating: 4 + (index % 2),
          comment: 'This course was really helpful and well-structured.',
          date: new Date().toISOString()
        })),
        requirements: [
          'Basic programming knowledge',
          'Understanding of web technologies',
          'A computer with internet access'
        ],
        what_you_will_learn: [
          'Build real-world applications',
          'Understand core principles',
          'Apply best practices',
          'Solve common problems'
        ]
      }
      
      set({ 
        currentCourse: courseDetails,
        isLoading: false 
      })
      
      return courseDetails
    } catch (error) {
      console.error('Failed to fetch course details:', error)
      set({ 
        error: AppError.from(error).message,
        isLoading: false,
        currentCourse: null
      })
      return null
    }
  },

  searchCourses: async (params) => {
    set({ 
      isLoading: true,
      searchParams: params,
      searchPage: 1
    })
    
    try {
      // Simulate API call with search parameters
      await new Promise(resolve => setTimeout(resolve, 700))
      
      const allCourses = await mockFetchCourses()
      
      // Filter courses based on search parameters
      let filtered = [...allCourses]
      
      if (params.query) {
        const query = params.query.toLowerCase()
        filtered = filtered.filter(course => 
          course.title.toLowerCase().includes(query) || 
          course.description.toLowerCase().includes(query) ||
          course.instructor.toLowerCase().includes(query)
        )
      }
      
      if (params.category) {
        filtered = filtered.filter(course => 
          course.category.toLowerCase() === params.category?.toLowerCase()
        )
      }
      
      if (params.level) {
        filtered = filtered.filter(course => 
          course.level === params.level
        )
      }
      
      // Sort results
      if (params.sortBy === 'popular') {
        filtered.sort((a, b) => b.students_count - a.students_count)
      } else if (params.sortBy === 'rating') {
        filtered.sort((a, b) => b.rating - a.rating)
      } else if (params.sortBy === 'newest') {
        filtered.sort((a, b) => 
          new Date(b.published_date).getTime() - new Date(a.published_date).getTime()
        )
      }
      
      set({ 
        searchResults: filtered.slice(0, 10),
        totalSearchResults: filtered.length,
        isLoading: false 
      })
    } catch (error) {
      console.error('Failed to search courses:', error)
      set({ 
        error: AppError.from(error).message,
        isLoading: false 
      })
    }
  },

  loadMoreSearchResults: async () => {
    const { searchResults, totalSearchResults, searchPage, searchParams } = get()
    
    // Don't load more if we already have all results
    if (searchResults.length >= totalSearchResults) {
      return
    }
    
    set({ isLoading: true })
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 700))
      
      const allCourses = await mockFetchCourses()
      // Duplicate courses to simulate more results
      const moreCourses = [...allCourses, ...allCourses, ...allCourses]
      
      // Apply the same filters as in searchCourses
      let filtered = [...moreCourses]
      
      if (searchParams.query) {
        const query = searchParams.query.toLowerCase()
        filtered = filtered.filter(course => 
          course.title.toLowerCase().includes(query) || 
          course.description.toLowerCase().includes(query)
        )
      }
      
      // Sort and paginate
      const nextPage = searchPage + 1
      const newResults = filtered.slice(searchResults.length, searchResults.length + 10)
      
      set({ 
        searchResults: [...searchResults, ...newResults],
        searchPage: nextPage,
        isLoading: false 
      })
    } catch (error) {
      console.error('Failed to load more search results:', error)
      set({ 
        error: AppError.from(error).message,
        isLoading: false 
      })
    }
  },

  clearSearchResults: () => {
    set({ 
      searchResults: [],
      searchParams: {
        query: '',
        category: null,
        level: null,
        sortBy: 'newest'
      },
      totalSearchResults: 0,
      searchPage: 1
    })
  },

  fetchEnrolledCourses: async () => {
    set({ isLoading: true })
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const allCourses = await mockFetchCourses()
      // Randomly select some courses as enrolled
      const enrolledCourses = allCourses
        .filter((_, index) => index % 3 === 0)
        .map(course => ({
          ...course,
          progress: Math.floor(Math.random() * 100)
        }))
      
      set({ 
        enrolledCourses,
        isLoading: false 
      })
    } catch (error) {
      console.error('Failed to fetch enrolled courses:', error)
      set({ 
        error: AppError.from(error).message,
        isLoading: false 
      })
    }
  },

  enrollInCourse: async (courseId) => {
    set({ isLoading: true })
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // Get the course details
      const courses = await mockFetchCourses()
      const course = courses.find(c => c.id === courseId)
      
      if (!course) {
        throw AppError.notFound(`Course with ID ${courseId} not found`)
      }
      
      // Add course to enrolled courses
      const enrolledCourse = {
        ...course,
        progress: 0,
        enrolled_date: new Date().toISOString()
      }
      
      set(state => ({ 
        enrolledCourses: [...state.enrolledCourses, enrolledCourse],
        isLoading: false 
      }))
      
      return true
    } catch (error) {
      console.error('Failed to enroll in course:', error)
      set({ 
        error: AppError.from(error).message,
        isLoading: false 
      })
      return false
    }
  },

  clearError: () => {
    set({ error: null })
  }
})) 