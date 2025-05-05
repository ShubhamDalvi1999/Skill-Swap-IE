import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

/**
 * Creates a Supabase client with the provided credentials.
 * If no credentials are provided, it falls back to environment variables.
 */
export const createSupabaseClient = (
  url = supabaseUrl,
  key = supabaseAnonKey,
  options = {}
) => {
  if (!url || !key) {
    console.error(
      'Missing Supabase credentials. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.'
    )
    return null
  }
  
  return createClient(url, key, options)
}

// Export a pre-configured client for convenience
export const supabase = createSupabaseClient()

/**
 * Get the current authenticated user
 */
export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) {
      throw error
    }
    
    return user
  } catch (error) {
    console.error('Error getting current user:', error.message)
    return null
  }
}

/**
 * Get user profile data
 */
export const getUserProfile = async (userId) => {
  try {
    if (!userId) {
      const user = await getCurrentUser()
      userId = user?.id
    }
    
    if (!userId) return null
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', userId)
      .single()
    
    if (error) throw error
    
    return data
  } catch (error) {
    console.error('Error fetching user profile:', error.message)
    return null
  }
}

/**
 * Sign up a new user
 */
export const signUp = async (email, password, userData = {}) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    })
    
    if (error) throw error
    
    return data
  } catch (error) {
    console.error('Error signing up:', error.message)
    throw error
  }
}

/**
 * Sign in with email and password
 */
export const signIn = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) throw error
    
    return data
  } catch (error) {
    console.error('Error signing in:', error.message)
    throw error
  }
}

/**
 * Sign out the current user
 */
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut()
    
    if (error) throw error
    
    return true
  } catch (error) {
    console.error('Error signing out:', error.message)
    throw error
  }
}

/**
 * Update user profile
 */
export const updateUserProfile = async (userId, profileData) => {
  try {
    if (!userId) {
      const user = await getCurrentUser()
      userId = user?.id
    }
    
    if (!userId) throw new Error('User ID is required')
    
    const { data, error } = await supabase
      .from('users')
      .update(profileData)
      .eq('user_id', userId)
      .select()
    
    if (error) throw error
    
    return data[0]
  } catch (error) {
    console.error('Error updating user profile:', error.message)
    throw error
  }
}

/**
 * Reset password
 */
export const resetPassword = async (email) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`
    })
    
    if (error) throw error
    
    return true
  } catch (error) {
    console.error('Error resetting password:', error.message)
    throw error
  }
}

/**
 * Get user token balance
 */
export const getUserTokenBalance = async (userId) => {
  try {
    if (!userId) {
      const user = await getCurrentUser()
      userId = user?.id
    }
    
    if (!userId) throw new Error('User ID is required')
    
    const { data, error } = await supabase
      .from('user_tokens')
      .select('token_balance')
      .eq('user_id', userId)
      .single()
    
    if (error) {
      // If no record exists, create one with initial balance of 0
      if (error.code === 'PGRST116') {
        const { data: newData, error: insertError } = await supabase
          .from('user_tokens')
          .insert({ user_id: userId, token_balance: 0 })
          .select('token_balance')
          .single()
        
        if (insertError) throw insertError
        
        return newData?.token_balance || 0
      } else {
        throw error
      }
    }
    
    return data?.token_balance || 0
  } catch (error) {
    console.error('Error getting token balance:', error.message)
    throw error
  }
}

/**
 * Record a token transaction
 */
export const recordTokenTransaction = async (userId, amount, transactionType, sourceType = null, sourceId = null, description = null) => {
  try {
    if (!userId) {
      const user = await getCurrentUser()
      userId = user?.id
    }
    
    if (!userId) throw new Error('User ID is required')
    
    // Check if user has enough tokens for spending transactions
    if (amount < 0) {
      const balance = await getUserTokenBalance(userId)
      if (balance < Math.abs(amount)) {
        throw new Error('Insufficient token balance')
      }
    }
    
    const { data, error } = await supabase
      .from('token_transactions')
      .insert({
        user_id: userId,
        amount,
        transaction_type: transactionType,
        source_type: sourceType,
        source_id: sourceId,
        description
      })
      .select()
    
    if (error) throw error
    
    return data[0]
  } catch (error) {
    console.error('Error recording token transaction:', error.message)
    throw error
  }
}

/**
 * Get course details with instructor information
 */
export const getCourseDetails = async (courseId) => {
  try {
    const { data, error } = await supabase
      .from('courses')
      .select(`
        *,
        difficulty_levels (*),
        course_instructors (
          user_id,
          users (*)
        ),
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
    console.error('Error fetching course details:', error.message)
    throw error
  }
}

/**
 * Enroll in a course
 */
export const enrollInCourse = async (courseId, tokensSpent = 0) => {
  try {
    const user = await getCurrentUser()
    if (!user) throw new Error('Must be logged in to enroll in a course')
    
    // Check if already enrolled
    const { data: existingEnrollment, error: checkError } = await supabase
      .from('enrollments')
      .select('enrollment_id')
      .eq('student_id', user.id)
      .eq('course_id', courseId)
      .maybeSingle()
    
    if (checkError) throw checkError
    
    if (existingEnrollment) {
      throw new Error('Already enrolled in this course')
    }
    
    // If spending tokens, record the transaction
    if (tokensSpent > 0) {
      await recordTokenTransaction(
        user.id, 
        -tokensSpent, 
        'spent', 
        'Course', 
        courseId, 
        'Enrollment in course'
      )
    }
    
    // Create enrollment record
    const { data, error } = await supabase
      .from('enrollments')
      .insert({
        student_id: user.id,
        course_id: courseId,
        tokens_spent: tokensSpent
      })
      .select()
    
    if (error) throw error
    
    return data[0]
  } catch (error) {
    console.error('Error enrolling in course:', error.message)
    throw error
  }
}

/**
 * Record progress for a lesson
 */
export const markLessonAsViewed = async (lessonId, isCompleted = true) => {
  try {
    const user = await getCurrentUser()
    if (!user) throw new Error('Must be logged in to record lesson progress')
    
    const { data, error } = await supabase
      .from('user_lesson_view')
      .upsert({
        user_id: user.id,
        lesson_id: lessonId,
        is_completed: isCompleted,
        viewed_date: new Date().toISOString()
      })
      .select()
    
    if (error) throw error
    
    return data[0]
  } catch (error) {
    console.error('Error marking lesson as viewed:', error.message)
    throw error
  }
}

/**
 * Mark a module as completed
 */
export const markModuleAsCompleted = async (moduleId) => {
  try {
    const user = await getCurrentUser()
    if (!user) throw new Error('Must be logged in to complete a module')
    
    const { data, error } = await supabase
      .from('user_module_completion')
      .upsert({
        user_id: user.id,
        module_id: moduleId,
        completion_date: new Date().toISOString()
      })
      .select()
    
    if (error) throw error
    
    // Update the course progress
    await updateCourseProgress(user.id, moduleId)
    
    return data[0]
  } catch (error) {
    console.error('Error completing module:', error.message)
    throw error
  }
}

/**
 * Update course progress based on completed modules
 */
export const updateCourseProgress = async (userId, moduleId) => {
  try {
    if (!userId) {
      const user = await getCurrentUser()
      userId = user?.id
    }
    
    if (!userId) throw new Error('User ID is required')
    
    // First get the course ID for this module
    const { data: moduleData, error: moduleError } = await supabase
      .from('modules')
      .select('course_id')
      .eq('module_id', moduleId)
      .single()
    
    if (moduleError) throw moduleError
    
    const courseId = moduleData.course_id
    
    // Count total modules in the course
    const { count: totalModules, error: countError } = await supabase
      .from('modules')
      .select('module_id', { count: 'exact', head: true })
      .eq('course_id', courseId)
    
    if (countError) throw countError
    
    // Count completed modules
    const { count: completedModules, error: completedError } = await supabase
      .from('user_module_completion')
      .select('module_id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .in('module_id', supabase
        .from('modules')
        .select('module_id')
        .eq('course_id', courseId)
      )
    
    if (completedError) throw completedError
    
    // Calculate progress percentage
    const progressPercent = Math.round((completedModules / totalModules) * 100)
    
    // Update the enrollment record
    const updateData = {
      progress_percent: progressPercent
    }
    
    // If progress is 100%, mark as completed
    if (progressPercent >= 100) {
      updateData.status = 'completed'
      updateData.completed_date = new Date().toISOString()
      
      // Get the trophy for this course's difficulty
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('difficulty_level, xp_points')
        .eq('course_id', courseId)
        .single()
      
      if (courseError) throw courseError
      
      // Get the trophy for this difficulty
      const { data: difficultyData, error: difficultyError } = await supabase
        .from('difficulty_levels')
        .select('trophy_type')
        .eq('difficulty_id', courseData.difficulty_level)
        .single()
      
      if (difficultyError) throw difficultyError
      
      // Get the trophy ID
      const { data: trophyData, error: trophyError } = await supabase
        .from('trophies')
        .select('trophy_id')
        .eq('name', difficultyData.trophy_type)
        .single()
      
      if (trophyError) throw trophyError
      
      // Update with trophy
      updateData.trophy_earned = trophyData.trophy_id
      
      // Award the trophy to the user
      const { error: trophyAwardError } = await supabase
        .from('user_trophies')
        .upsert({
          user_id: userId,
          trophy_id: trophyData.trophy_id,
          course_id: courseId,
          date_earned: new Date().toISOString()
        })
      
      if (trophyAwardError && !trophyAwardError.message.includes('duplicate key')) {
        throw trophyAwardError
      }
      
      // Update user's XP
      const { error: xpError } = await supabase
        .from('users')
        .update({
          total_xp: supabase.rpc('increment', { x: courseData.xp_points })
        })
        .eq('user_id', userId)
      
      if (xpError) throw xpError
      
      // Award completion tokens
      await recordTokenTransaction(
        userId,
        courseData.xp_points / 10, // Award tokens proportional to XP
        'reward',
        'Course',
        courseId,
        'Course completion reward'
      )
    }
    
    // Update enrollment record
    const { data, error } = await supabase
      .from('enrollments')
      .update(updateData)
      .eq('student_id', userId)
      .eq('course_id', courseId)
      .select()
    
    if (error) throw error
    
    return data[0]
  } catch (error) {
    console.error('Error updating course progress:', error.message)
    throw error
  }
}

/**
 * Submit a quiz attempt
 */
export const submitQuizAttempt = async (quizId, answers) => {
  try {
    const user = await getCurrentUser()
    if (!user) throw new Error('Must be logged in to submit a quiz')
    
    // Create the quiz attempt
    const { data: attemptData, error: attemptError } = await supabase
      .from('user_quiz_attempts')
      .insert({
        user_id: user.id,
        quiz_id: quizId,
        score: 0, // Will be updated after scoring
        started_at: new Date().toISOString(),
        completed_at: new Date().toISOString()
      })
      .select()
      .single()
    
    if (attemptError) throw attemptError
    
    const attemptId = attemptData.attempt_id
    
    // Process and submit each answer
    let totalScore = 0
    const totalPossible = Object.keys(answers).length * 100
    
    for (const [questionId, optionId] of Object.entries(answers)) {
      // Check if the answer is correct
      const { data: optionData, error: optionError } = await supabase
        .from('quiz_options')
        .select('is_correct, question_id')
        .eq('option_id', optionId)
        .single()
      
      if (optionError) throw optionError
      
      const isCorrect = optionData.is_correct
      
      // If correct, add to the score
      if (isCorrect) {
        totalScore += 100
      }
      
      // Record the answer
      const { error: answerError } = await supabase
        .from('user_quiz_answers')
        .insert({
          attempt_id: attemptId,
          question_id: questionId,
          option_id: optionId,
          is_correct: isCorrect
        })
      
      if (answerError) throw answerError
    }
    
    // Calculate final score as percentage
    const finalScore = Math.round((totalScore / totalPossible) * 100)
    const isPassed = finalScore >= 70 // 70% to pass
    
    // Update the attempt with the score
    const { data, error } = await supabase
      .from('user_quiz_attempts')
      .update({
        score: finalScore,
        is_passed: isPassed
      })
      .eq('attempt_id', attemptId)
      .select()
      .single()
    
    if (error) throw error
    
    return {
      ...data,
      isPassed
    }
  } catch (error) {
    console.error('Error submitting quiz:', error.message)
    throw error
  }
}

/**
 * Submit an assignment
 */
export const submitAssignment = async (assignmentId, submissionText, fileUrl = null) => {
  try {
    const user = await getCurrentUser()
    if (!user) throw new Error('Must be logged in to submit an assignment')
    
    const { data, error } = await supabase
      .from('user_assignment_submissions')
      .upsert({
        user_id: user.id,
        assignment_id: assignmentId,
        submission_text: submissionText,
        file_url: fileUrl,
        submission_date: new Date().toISOString()
      })
      .select()
    
    if (error) throw error
    
    return data[0]
  } catch (error) {
    console.error('Error submitting assignment:', error.message)
    throw error
  }
}

/**
 * Rate a course
 */
export const rateCourse = async (courseId, rating, reviewText = null) => {
  try {
    const user = await getCurrentUser()
    if (!user) throw new Error('Must be logged in to rate a course')
    
    // Check if enrolled
    const { data: enrollment, error: enrollmentError } = await supabase
      .from('enrollments')
      .select('enrollment_id')
      .eq('student_id', user.id)
      .eq('course_id', courseId)
      .maybeSingle()
    
    if (enrollmentError) throw enrollmentError
    
    if (!enrollment) {
      throw new Error('Must be enrolled in a course to rate it')
    }
    
    // Submit or update rating
    const { data, error } = await supabase
      .from('course_ratings')
      .upsert({
        student_id: user.id,
        course_id: courseId,
        rating,
        review_text: reviewText,
        rating_date: new Date().toISOString()
      })
      .select()
    
    if (error) throw error
    
    return data[0]
  } catch (error) {
    console.error('Error rating course:', error.message)
    throw error
  }
}

export default supabase 