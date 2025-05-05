import { supabase } from './supabase'

/**
 * Fetch all published courses
 * @returns {Promise<Array>} - List of published courses
 */
export const fetchPublishedCourses = async () => {
  try {
    const { data, error } = await supabase
      .from('courses')
      .select(`
        *,
        course_instructors (
          user_id,
          users (name, email, profile_info)
        ),
        difficulty_levels (name, trophy_type)
      `)
      .eq('status', 'published')
      .order('created_date', { ascending: false })
    
    if (error) throw error
    
    return data
  } catch (error) {
    console.error('Error fetching published courses:', error.message)
    throw error
  }
}

/**
 * Fetch a single course by ID
 * @param {string} courseId - The course ID to fetch
 * @returns {Promise<Object>} - Course details
 */
export const fetchCourseById = async (courseId) => {
  try {
    const { data, error } = await supabase
      .from('courses')
      .select(`
        *,
        course_instructors (
          user_id,
          users (name, email, profile_info)
        ),
        difficulty_levels (name, trophy_type),
        modules (
          *,
          lessons (*)
        )
      `)
      .eq('course_id', courseId)
      .single()
    
    if (error) throw error
    
    return data
  } catch (error) {
    console.error(`Error fetching course by ID ${courseId}:`, error.message)
    throw error
  }
}

/**
 * Create a new course
 * @param {Object} courseData - Course data
 * @param {string} userId - ID of the user creating the course
 * @returns {Promise<Object>} - Created course details
 */
export const createCourse = async (courseData, userId) => {
  try {
    if (!userId) {
      throw new Error('User ID is required to create a course')
    }

    // Start a transaction
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .insert({
        title: courseData.title,
        description: courseData.description,
        difficulty_level: courseData.difficulty_level,
        xp_points: courseData.xp_points || 100,
        launch_token_cost: courseData.launch_token_cost || 0,
        status: courseData.status || 'draft',
        thumbnail_url: courseData.thumbnail_url
      })
      .select()
      .single()
    
    if (courseError) throw courseError
    
    // Assign the creator as an instructor
    const { error: instructorError } = await supabase
      .from('course_instructors')
      .insert({
        user_id: userId,
        course_id: course.course_id
      })
    
    if (instructorError) throw instructorError
    
    return course
  } catch (error) {
    console.error('Error creating course:', error.message)
    throw error
  }
}

/**
 * Update an existing course
 * @param {string} courseId - ID of the course to update
 * @param {Object} courseData - Updated course data
 * @returns {Promise<Object>} - Updated course details
 */
export const updateCourse = async (courseId, courseData) => {
  try {
    const { data, error } = await supabase
      .from('courses')
      .update(courseData)
      .eq('course_id', courseId)
      .select()
      .single()
    
    if (error) throw error
    
    return data
  } catch (error) {
    console.error(`Error updating course ${courseId}:`, error.message)
    throw error
  }
}

/**
 * Publish a course
 * @param {string} courseId - ID of the course to publish
 * @returns {Promise<Object>} - Published course details
 */
export const publishCourse = async (courseId) => {
  try {
    const { data, error } = await supabase
      .from('courses')
      .update({ status: 'published' })
      .eq('course_id', courseId)
      .select()
      .single()
    
    if (error) throw error
    
    return data
  } catch (error) {
    console.error(`Error publishing course ${courseId}:`, error.message)
    throw error
  }
}

/**
 * Delete a course
 * @param {string} courseId - ID of the course to delete
 * @returns {Promise<boolean>} - Success status
 */
export const deleteCourse = async (courseId) => {
  try {
    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('course_id', courseId)
    
    if (error) throw error
    
    return true
  } catch (error) {
    console.error(`Error deleting course ${courseId}:`, error.message)
    throw error
  }
}

/**
 * Enroll a user in a course
 * @param {string} userId - ID of the user to enroll
 * @param {string} courseId - ID of the course
 * @param {number} tokensSpent - Optional number of tokens spent
 * @returns {Promise<Object>} - Enrollment details
 */
export const enrollUserInCourse = async (userId, courseId, tokensSpent = 0) => {
  try {
    // Check if user is already enrolled
    const { data: existingEnrollment, error: checkError } = await supabase
      .from('enrollments')
      .select('*')
      .eq('student_id', userId)
      .eq('course_id', courseId)
      .maybeSingle()
    
    if (checkError) throw checkError
    
    if (existingEnrollment) {
      return existingEnrollment
    }
    
    // Create enrollment record
    const { data, error } = await supabase
      .from('enrollments')
      .insert({
        student_id: userId,
        course_id: courseId,
        tokens_spent: tokensSpent
      })
      .select()
      .single()
    
    if (error) throw error
    
    // If tokens were spent, record the transaction
    if (tokensSpent > 0) {
      const { error: txError } = await supabase
        .from('token_transactions')
        .insert({
          user_id: userId,
          amount: -tokensSpent,
          transaction_type: 'spent',
          source_type: 'Course',
          source_id: courseId,
          description: `Enrollment in course: ${courseId}`
        })
      
      if (txError) throw txError
    }
    
    return data
  } catch (error) {
    console.error(`Error enrolling user ${userId} in course ${courseId}:`, error.message)
    throw error
  }
}

/**
 * Get courses taught by an instructor
 * @param {string} instructorId - ID of the instructor
 * @returns {Promise<Array>} - List of courses
 */
export const getInstructorCourses = async (instructorId) => {
  try {
    const { data, error } = await supabase
      .from('course_instructors')
      .select(`
        course_id,
        courses (*)
      `)
      .eq('user_id', instructorId)
    
    if (error) throw error
    
    // Transform the data to flatten the structure
    return data.map(item => item.courses)
  } catch (error) {
    console.error(`Error fetching courses for instructor ${instructorId}:`, error.message)
    throw error
  }
}

/**
 * Get courses a user is enrolled in
 * @param {string} userId - ID of the user
 * @returns {Promise<Array>} - List of enrolled courses with progress
 */
export const getUserEnrollments = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('enrollments')
      .select(`
        *,
        courses (
          *,
          course_instructors (
            user_id,
            users (name, email, profile_info)
          ),
          difficulty_levels (name, trophy_type)
        )
      `)
      .eq('student_id', userId)
    
    if (error) throw error
    
    return data
  } catch (error) {
    console.error(`Error fetching enrollments for user ${userId}:`, error.message)
    throw error
  }
}

/**
 * Update a user's progress in a course
 * @param {string} userId - ID of the user
 * @param {string} courseId - ID of the course
 * @param {number} progressPercent - New progress percentage
 * @returns {Promise<Object>} - Updated enrollment details
 */
export const updateCourseProgress = async (userId, courseId, progressPercent) => {
  try {
    const { data, error } = await supabase
      .from('enrollments')
      .update({ 
        progress_percent: progressPercent,
        // If progress is 100%, mark as completed
        ...(progressPercent >= 100 ? {
          status: 'completed',
          completed_date: new Date().toISOString()
        } : {})
      })
      .eq('student_id', userId)
      .eq('course_id', courseId)
      .select()
      .single()
    
    if (error) throw error
    
    // If the course is now completed, handle trophy awarding
    if (progressPercent >= 100) {
      // Get course difficulty to determine trophy
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select(`
          difficulty_level,
          difficulty_levels (trophy_type),
          xp_points
        `)
        .eq('course_id', courseId)
        .single()
      
      if (courseError) throw courseError
      
      if (courseData) {
        // Get trophy ID based on difficulty
        const { data: trophyData, error: trophyError } = await supabase
          .from('trophies')
          .select('trophy_id')
          .eq('name', courseData.difficulty_levels.trophy_type)
          .single()
        
        if (trophyError) throw trophyError
        
        if (trophyData) {
          // Award trophy to user
          const { error: awardError } = await supabase
            .from('user_trophies')
            .insert({
              user_id: userId,
              trophy_id: trophyData.trophy_id,
              course_id: courseId
            })
          
          if (awardError && !awardError.message.includes('violates unique constraint')) {
            throw awardError
          }
          
          // Update enrollment with trophy
          const { error: enrollmentError } = await supabase
            .from('enrollments')
            .update({ trophy_earned: trophyData.trophy_id })
            .eq('student_id', userId)
            .eq('course_id', courseId)
          
          if (enrollmentError) throw enrollmentError
          
          // Add XP to user
          const { error: xpError } = await supabase
            .from('users')
            .update({ 
              total_xp: supabase.rpc('increment', { x: courseData.xp_points }) 
            })
            .eq('user_id', userId)
          
          if (xpError) throw xpError
        }
      }
    }
    
    return data
  } catch (error) {
    console.error(`Error updating progress for user ${userId} in course ${courseId}:`, error.message)
    throw error
  }
}

/**
 * Rate a course
 * @param {string} userId - ID of the user rating the course
 * @param {string} courseId - ID of the course being rated
 * @param {number} rating - Rating (1-5)
 * @param {string} reviewText - Optional review text
 * @returns {Promise<Object>} - Rating details
 */
export const rateCourse = async (userId, courseId, rating, reviewText = null) => {
  try {
    // Check if user is enrolled in the course
    const { data: enrollment, error: enrollmentError } = await supabase
      .from('enrollments')
      .select('enrollment_id')
      .eq('student_id', userId)
      .eq('course_id', courseId)
      .maybeSingle()
    
    if (enrollmentError) throw enrollmentError
    
    if (!enrollment) {
      throw new Error('You must be enrolled in the course to rate it')
    }
    
    // Check if user has already rated this course
    const { data: existingRating, error: ratingCheckError } = await supabase
      .from('course_ratings')
      .select('rating_id')
      .eq('student_id', userId)
      .eq('course_id', courseId)
      .maybeSingle()
    
    if (ratingCheckError) throw ratingCheckError
    
    if (existingRating) {
      // Update existing rating
      const { data, error } = await supabase
        .from('course_ratings')
        .update({ 
          rating,
          review_text: reviewText,
          rating_date: new Date().toISOString()
        })
        .eq('rating_id', existingRating.rating_id)
        .select()
        .single()
      
      if (error) throw error
      return data
    } else {
      // Create new rating
      const { data, error } = await supabase
        .from('course_ratings')
        .insert({
          student_id: userId,
          course_id: courseId,
          rating,
          review_text: reviewText
        })
        .select()
        .single()
      
      if (error) throw error
      return data
    }
  } catch (error) {
    console.error(`Error rating course ${courseId}:`, error.message)
    throw error
  }
} 