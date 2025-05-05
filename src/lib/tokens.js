import { supabase } from './supabase'

/**
 * Get a user's token balance
 * @param {string} userId - ID of the user
 * @returns {Promise<number>} - Current token balance
 */
export const getUserTokenBalance = async (userId) => {
  try {
    // Check if user has a token balance record
    const { data, error } = await supabase
      .from('user_tokens')
      .select('token_balance')
      .eq('user_id', userId)
      .maybeSingle()
    
    if (error) throw error
    
    if (!data) {
      // Create a token balance record if it doesn't exist
      const { data: newData, error: insertError } = await supabase
        .from('user_tokens')
        .insert({ user_id: userId, token_balance: 0 })
        .select('token_balance')
        .single()
      
      if (insertError) throw insertError
      
      return newData?.token_balance || 0
    }
    
    return data.token_balance
  } catch (error) {
    console.error(`Error getting token balance for user ${userId}:`, error.message)
    throw error
  }
}

/**
 * Add tokens to a user's balance
 * @param {string} userId - ID of the user
 * @param {number} amount - Amount of tokens to add (positive number)
 * @param {string} transactionType - Type of transaction
 * @param {string} sourceType - Source entity type
 * @param {string} sourceId - Source entity ID
 * @param {string} description - Transaction description
 * @returns {Promise<number>} - New token balance
 */
export const addTokens = async (
  userId, 
  amount, 
  transactionType = 'earned', 
  sourceType = null, 
  sourceId = null, 
  description = null
) => {
  try {
    if (amount <= 0) {
      throw new Error('Amount must be positive when adding tokens')
    }
    
    // Record the transaction
    const { error: txError } = await supabase
      .from('token_transactions')
      .insert({
        user_id: userId,
        amount,
        transaction_type: transactionType,
        source_type: sourceType,
        source_id: sourceId,
        description
      })
    
    if (txError) throw txError
    
    // The trigger will update the user_tokens table, so get the new balance
    return await getUserTokenBalance(userId)
  } catch (error) {
    console.error(`Error adding tokens for user ${userId}:`, error.message)
    throw error
  }
}

/**
 * Remove tokens from a user's balance
 * @param {string} userId - ID of the user
 * @param {number} amount - Amount of tokens to remove (positive number)
 * @param {string} transactionType - Type of transaction
 * @param {string} sourceType - Source entity type
 * @param {string} sourceId - Source entity ID
 * @param {string} description - Transaction description
 * @returns {Promise<number>} - New token balance
 */
export const removeTokens = async (
  userId, 
  amount, 
  transactionType = 'spent', 
  sourceType = null, 
  sourceId = null, 
  description = null
) => {
  try {
    if (amount <= 0) {
      throw new Error('Amount must be positive when removing tokens')
    }
    
    // Check if user has enough tokens
    const currentBalance = await getUserTokenBalance(userId)
    
    if (currentBalance < amount) {
      throw new Error('Insufficient tokens')
    }
    
    // Record the transaction (negative amount)
    const { error: txError } = await supabase
      .from('token_transactions')
      .insert({
        user_id: userId,
        amount: -amount,
        transaction_type: transactionType,
        source_type: sourceType,
        source_id: sourceId,
        description
      })
    
    if (txError) throw txError
    
    // The trigger will update the user_tokens table, so get the new balance
    return await getUserTokenBalance(userId)
  } catch (error) {
    console.error(`Error removing tokens from user ${userId}:`, error.message)
    throw error
  }
}

/**
 * Get token transaction history for a user
 * @param {string} userId - ID of the user
 * @param {number} limit - Maximum number of transactions to return
 * @param {number} offset - Offset for pagination
 * @returns {Promise<Array>} - List of transactions
 */
export const getTokenTransactionHistory = async (userId, limit = 20, offset = 0) => {
  try {
    const { data, error } = await supabase
      .from('token_transactions')
      .select('*')
      .eq('user_id', userId)
      .order('transaction_date', { ascending: false })
      .range(offset, offset + limit - 1)
    
    if (error) throw error
    
    return data
  } catch (error) {
    console.error(`Error fetching token transactions for user ${userId}:`, error.message)
    throw error
  }
}

/**
 * Transfer tokens from one user to another
 * @param {string} fromUserId - ID of the sender
 * @param {string} toUserId - ID of the recipient
 * @param {number} amount - Amount of tokens to transfer
 * @param {string} description - Transaction description
 * @returns {Promise<boolean>} - Success status
 */
export const transferTokens = async (fromUserId, toUserId, amount, description = null) => {
  try {
    if (amount <= 0) {
      throw new Error('Amount must be positive for transfers')
    }
    
    if (fromUserId === toUserId) {
      throw new Error('Cannot transfer tokens to yourself')
    }
    
    // Check if sender has enough tokens
    const senderBalance = await getUserTokenBalance(fromUserId)
    
    if (senderBalance < amount) {
      throw new Error('Insufficient tokens for transfer')
    }
    
    // Create transactions for both users
    const { error: senderError } = await supabase
      .from('token_transactions')
      .insert({
        user_id: fromUserId,
        amount: -amount,
        transaction_type: 'spent',
        source_type: 'Transfer',
        source_id: toUserId,
        description: description || `Transfer to user ${toUserId}`
      })
    
    if (senderError) throw senderError
    
    const { error: recipientError } = await supabase
      .from('token_transactions')
      .insert({
        user_id: toUserId,
        amount: amount,
        transaction_type: 'earned',
        source_type: 'Transfer',
        source_id: fromUserId,
        description: description || `Transfer from user ${fromUserId}`
      })
    
    if (recipientError) throw recipientError
    
    return true
  } catch (error) {
    console.error(`Error transferring tokens from ${fromUserId} to ${toUserId}:`, error.message)
    throw error
  }
}

/**
 * Award tokens to a user for completing a course
 * @param {string} userId - ID of the user
 * @param {string} courseId - ID of the completed course
 * @returns {Promise<number>} - Amount of tokens awarded
 */
export const awardCompletionTokens = async (userId, courseId) => {
  try {
    // Check if the course is completed
    const { data: enrollment, error: enrollmentError } = await supabase
      .from('enrollments')
      .select('status')
      .eq('student_id', userId)
      .eq('course_id', courseId)
      .single()
    
    if (enrollmentError) throw enrollmentError
    
    if (!enrollment || enrollment.status !== 'completed') {
      throw new Error('Course is not completed')
    }
    
    // Get course data to determine token reward
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select(`
        difficulty_level,
        difficulty_levels (xp_factor)
      `)
      .eq('course_id', courseId)
      .single()
    
    if (courseError) throw courseError
    
    // Calculate token reward based on difficulty
    const baseReward = 10
    const xpFactor = course.difficulty_levels?.xp_factor || 1
    const tokenReward = baseReward * xpFactor
    
    // Add tokens to user
    await addTokens(
      userId,
      tokenReward,
      'reward',
      'Course',
      courseId,
      `Reward for completing course: ${courseId}`
    )
    
    return tokenReward
  } catch (error) {
    console.error(`Error awarding completion tokens for user ${userId}, course ${courseId}:`, error.message)
    throw error
  }
} 