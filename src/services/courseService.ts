// @ts-nocheck
import { createBrowserClient } from '@supabase/ssr'
import type { 
  Course, 
  CourseDetails, 
  CourseSearchParams, 
  CourseReview,
  CourseProgress,
  CourseModule
} from '@/types/course'
import { AppError } from '@/lib/errors/AppError'

/**
 * Service class for handling all course-related operations
 */
export class CourseService {
  private supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY 
  )

  /**
   * Get all courses with pagination
   */
  async getCourses(page = 1, pageSize = 10): Promise<{ courses: Course[], total: number }> {
    try {
      const from = (page - 1) * pageSize
      const to = from + pageSize - 1

      const { data, error, count } = await this.supabase
        .from('courses')
        .select('*', { count: 'exact' })
        .range(from, to)
        .order('published_date', { ascending: false })

      if (error) throw AppError.server(error.message, { cause: error })

      return {
        courses: data || [],
        total: count || 0
      }
    } catch (error) {
      throw AppError.from(error, 'Failed to fetch courses')
    }
  }

  /**
   * Get featured courses
   */
  async getFeaturedCourses(limit = 4): Promise<Course[]> {
    try {
      const { data, error } = await this.supabase
        .from('courses')
        .select('*')
        .eq('is_featured', true)
        .limit(limit)

      if (error) throw AppError.server(error.message, { cause: error })

      return data || []
    } catch (error) {
      throw AppError.from(error, 'Failed to fetch featured courses')
    }
  }

  /**
   * Get popular courses based on enrollment count
   */
  async getPopularCourses(limit = 5): Promise<Course[]> {
    try {
      const { data, error } = await this.supabase
        .from('courses')
        .select('*')
        .order('students_count', { ascending: false })
        .limit(limit)

      if (error) throw AppError.server(error.message, { cause: error })

      return data || []
    } catch (error) {
      throw AppError.from(error, 'Failed to fetch popular courses')
    }
  }

  /**
   * Get newest courses
   */
  async getNewCourses(limit = 5): Promise<Course[]> {
    try {
      const { data, error } = await this.supabase
        .from('courses')
        .select('*')
        .order('published_date', { ascending: false })
        .limit(limit)

      if (error) throw AppError.server(error.message, { cause: error })

      return data || []
    } catch (error) {
      throw AppError.from(error, 'Failed to fetch new courses')
    }
  }

  /**
   * Get courses by category
   */
  async getCoursesByCategory(category: string, limit = 10): Promise<Course[]> {
    try {
      const { data, error } = await this.supabase
        .from('courses')
        .select('*')
        .eq('category', category)
        .limit(limit)

      if (error) throw AppError.server(error.message, { cause: error })

      return data || []
    } catch (error) {
      throw AppError.from(error, 'Failed to fetch courses by category')
    }
  }

  /**
   * Get a single course by ID
   */
  async getCourseById(courseId: string): Promise<CourseDetails | null> {
    try {
      // First get the basic course information
      const { data: course, error: courseError } = await this.supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .single()

      if (courseError) {
        if (courseError.code === 'PGRST116') {
          throw AppError.notFound(`Course with ID ${courseId} not found`)
        }
        throw AppError.server(courseError.message, { cause: courseError })
      }

      if (!course) return null

      // Get modules and their lessons for this course
      const { data: modules, error: modulesError } = await this.supabase
        .from('course_modules')
        .select(`
          id, 
          title, 
          description, 
          duration,
          course_lessons (
            id, 
            title, 
            duration, 
            video_url,
            is_free
          )
        `)
        .eq('course_id', courseId)
        .order('order_index', { ascending: true })

      if (modulesError) throw AppError.server(modulesError.message, { cause: modulesError })

      // Get course resources
      const { data: resources, error: resourcesError } = await this.supabase
        .from('course_resources')
        .select('*')
        .eq('course_id', courseId)

      if (resourcesError) throw AppError.server(resourcesError.message, { cause: resourcesError })

      // Get course reviews
      const { data: reviews, error: reviewsError } = await this.supabase
        .from('course_reviews')
        .select(`
          id,
          rating,
          comment,
          created_at,
          profiles!inner (
            id,
            full_name,
            avatar_url
          )
        `)
        .eq('course_id', courseId)
        .order('created_at', { ascending: false })

      if (reviewsError) throw AppError.server(reviewsError.message, { cause: reviewsError })

      // Get course requirements and learning objectives
      const { data: metadata, error: metadataError } = await this.supabase
        .from('course_metadata')
        .select('requirements, learning_objectives')
        .eq('course_id', courseId)
        .single()

      if (metadataError && metadataError.code !== 'PGRST116') {
        throw AppError.server(metadataError.message, { cause: metadataError })
      }

      // Format the syllabus data
      const formattedModules: CourseModule[] = modules?.map(module => ({
        id: module.id,
        title: module.title,
        description: module.description || '',
        duration: module.duration || 0,
        lessons: module.course_lessons?.map(lesson => ({
          id: lesson.id,
          title: lesson.title,
          duration: lesson.duration,
          videoUrl: lesson.video_url,
          completed: false // This will be updated later with user progress data
        })) || []
      })) || []

      // Format the reviews
      const formattedReviews: CourseReview[] = reviews?.map(review => ({
        id: review.id,
        user: review.profiles.full_name,
        avatar: review.profiles.avatar_url || '',
        rating: review.rating,
        comment: review.comment,
        date: review.created_at
      })) || []

      // Compile the full course details
      const courseDetails: CourseDetails = {
        ...course,
        syllabus: formattedModules,
        resources: resources || [],
        reviews: formattedReviews,
        requirements: metadata?.requirements || [],
        what_you_will_learn: metadata?.learning_objectives || []
      }

      return courseDetails
    } catch (error) {
      if (error instanceof AppError) throw error
      throw AppError.from(error, 'Failed to fetch course details')
    }
  }

  /**
   * Search for courses based on various parameters
   */
  async searchCourses(params: CourseSearchParams): Promise<{ courses: Course[], total: number }> {
    try {
      let query = this.supabase
        .from('courses')
        .select('*', { count: 'exact' })

      // Apply filters
      if (params.query && params.query.trim() !== '') {
        query = query.or(`title.ilike.%${params.query}%,description.ilike.%${params.query}%`)
      }

      if (params.category) {
        query = query.eq('category', params.category)
      }

      if (params.level) {
        query = query.eq('level', params.level)
      }

      // Apply sorting
      switch (params.sortBy) {
        case 'popular':
          query = query.order('students_count', { ascending: false })
          break
        case 'rating':
          query = query.order('rating', { ascending: false })
          break
        default:
          query = query.order('published_date', { ascending: false })
          break
      }

      const { data, error, count } = await query

      if (error) throw AppError.server(error.message, { cause: error })

      return {
        courses: data || [],
        total: count || 0
      }
    } catch (error) {
      throw AppError.from(error, 'Failed to search courses')
    }
  }

  /**
   * Get courses that a user is enrolled in
   */
  async getEnrolledCourses(userId: string): Promise<Course[]> {
    try {
      const { data, error } = await this.supabase
        .from('course_enrollments')
        .select(`
          enrollment_date,
          progress,
          courses (*)
        `)
        .eq('user_id', userId)
        .order('enrollment_date', { ascending: false })

      if (error) throw AppError.server(error.message, { cause: error })

      // Transform the data to the expected format
      return data?.map(enrollment => ({
        ...enrollment.courses,
        progress: enrollment.progress || 0,
        enrolled_date: enrollment.enrollment_date
      })) || []
    } catch (error) {
      throw AppError.from(error, 'Failed to fetch enrolled courses')
    }
  }

  /**
   * Enroll a user in a course
   */
  async enrollInCourse(userId: string, courseId: string, paymentMethod?: string, couponCode?: string): Promise<boolean> {
    try {
      const enrollment = {
        user_id: userId,
        course_id: courseId,
        enrollment_date: new Date().toISOString(),
        progress: 0,
        payment_method: paymentMethod,
        coupon_code: couponCode
      }

      const { error } = await this.supabase
        .from('course_enrollments')
        .insert(enrollment)

      if (error) {
        // Handle unique constraint violation (already enrolled)
        if (error.code === '23505') {
          throw AppError.validation('You are already enrolled in this course')
        }
        throw AppError.server(error.message, { cause: error })
      }

      // Update the course's student count
      await this.supabase.rpc('increment_course_students', { course_id: courseId })

      return true
    } catch (error) {
      throw AppError.from(error, 'Failed to enroll in course')
    }
  }

  /**
   * Update a user's progress in a course
   */
  async updateCourseProgress(progressData: CourseProgress): Promise<boolean> {
    try {
      const { courseId, userId, progress, completedLessons } = progressData

      // First update the enrollment record
      const { error: enrollmentError } = await this.supabase
        .from('course_enrollments')
        .update({
          progress,
          last_accessed_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('course_id', courseId)

      if (enrollmentError) throw AppError.server(enrollmentError.message, { cause: enrollmentError })

      // Then update the lesson completion records if provided
      if (completedLessons && completedLessons.length > 0) {
        // First get existing completion records
        const { data: existingCompletions, error: fetchError } = await this.supabase
          .from('lesson_completions')
          .select('lesson_id')
          .eq('user_id', userId)
          .in('lesson_id', completedLessons)

        if (fetchError) throw AppError.server(fetchError.message, { cause: fetchError })

        // Filter out lessons that are already marked as completed
        const existingLessonIds = existingCompletions?.map(ec => ec.lesson_id) || []
        const newCompletions = completedLessons
          .filter(lessonId => !existingLessonIds.includes(lessonId))
          .map(lessonId => ({
            user_id: userId,
            lesson_id: lessonId,
            completed_at: new Date().toISOString()
          }))

        // Insert new completion records
        if (newCompletions.length > 0) {
          const { error: completionError } = await this.supabase
            .from('lesson_completions')
            .insert(newCompletions)

          if (completionError) throw AppError.server(completionError.message, { cause: completionError })
        }
      }

      return true
    } catch (error) {
      throw AppError.from(error, 'Failed to update course progress')
    }
  }

  /**
   * Submit a review for a course
   */
  async submitCourseReview(userId: string, courseId: string, rating: number, comment: string): Promise<boolean> {
    try {
      // Check if user is enrolled in the course
      const { data: enrollment, error: enrollmentError } = await this.supabase
        .from('course_enrollments')
        .select('id')
        .eq('user_id', userId)
        .eq('course_id', courseId)
        .single()

      if (enrollmentError && enrollmentError.code !== 'PGRST116') {
        throw AppError.server(enrollmentError.message, { cause: enrollmentError })
      }

      if (!enrollment) {
        throw AppError.validation('You must be enrolled in this course to submit a review')
      }

      // Check if user already reviewed this course
      const { data: existingReview, error: reviewCheckError } = await this.supabase
        .from('course_reviews')
        .select('id')
        .eq('user_id', userId)
        .eq('course_id', courseId)
        .single()

      if (reviewCheckError && reviewCheckError.code !== 'PGRST116') {
        throw AppError.server(reviewCheckError.message, { cause: reviewCheckError })
      }

      let operation
      if (existingReview) {
        // Update existing review
        operation = this.supabase
          .from('course_reviews')
          .update({ rating, comment, updated_at: new Date().toISOString() })
          .eq('id', existingReview.id)
      } else {
        // Insert new review
        operation = this.supabase
          .from('course_reviews')
          .insert({
            user_id: userId,
            course_id: courseId,
            rating,
            comment,
            created_at: new Date().toISOString()
          })
      }

      const { error } = await operation
      if (error) throw AppError.server(error.message, { cause: error })

      // Update the course's rating summary
      await this.supabase.rpc('update_course_rating', { course_id: courseId })

      return true
    } catch (error) {
      throw AppError.from(error, 'Failed to submit course review')
    }
  }

  /**
   * Get lessons that a user has completed
   */
  async getUserCompletedLessons(userId: string, courseId: string): Promise<string[]> {
    try {
      const { data, error } = await this.supabase
        .from('lesson_completions')
        .select('lesson_id')
        .eq('user_id', userId)
        .in('lesson_id', (query) => {
          query.from('course_lessons')
            .select('id')
            .eq('course_id', courseId)
        })

      if (error) throw AppError.server(error.message, { cause: error })

      return data?.map(completion => completion.lesson_id) || []
    } catch (error) {
      throw AppError.from(error, 'Failed to fetch completed lessons')
    }
  }
} 