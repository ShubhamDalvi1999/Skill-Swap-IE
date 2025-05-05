// @ts-nocheck
import { createBrowserClient } from '@supabase/ssr'
import { UserProfile } from '@/types/user'
import { AppError } from '@/lib/errors/AppError'
import { SignInFormValues, SignUpFormValues } from '@/schemas/authSchemas'
import { supabaseConfig } from '@/config/env'
import { createMockSupabaseClient } from '@/utils/supabase/mockClient'

// Create a singleton instance to prevent multiple initializations
let supabaseInstance = null;

/**
 * Get or create a Supabase client instance
 * This prevents issues with multiple instances and circular dependencies
 */
function getSupabaseClient() {
  // Don't create client during server-side rendering
  if (typeof window === 'undefined') {
    return createMockSupabaseClient();
  }
  
  if (supabaseInstance) {
    return supabaseInstance;
  }
  
  const supabaseUrl = supabaseConfig.url;
  const supabaseKey = supabaseConfig.anonKey;
  
  if (!supabaseUrl || !supabaseKey) {
    supabaseInstance = createMockSupabaseClient();
  } else {
    try {
      supabaseInstance = createBrowserClient(supabaseUrl, supabaseKey);
    } catch (error) {
      console.error('Failed to create Supabase client:', error);
      supabaseInstance = createMockSupabaseClient();
    }
  }
  
  return supabaseInstance;
}

export class AuthService {
  private supabase;

  constructor() {
    this.supabase = getSupabaseClient();
  }

  // Track login attempts to prevent brute force attacks
  private static loginAttempts = new Map<string, { count: number, lastAttempt: number }>()
  
  // Maximum allowed login attempts before lockout
  private static MAX_LOGIN_ATTEMPTS = 5
  
  // Lockout period in milliseconds (15 minutes)
  private static LOCKOUT_PERIOD = 15 * 60 * 1000

  /**
   * Get the current user session
   */
  async getCurrentUser() {
    try {
      const { data: { session }, error } = await this.supabase.auth.getSession()
      
      if (error) throw AppError.auth(error.message, { cause: error })
      
      if (!session) {
        return null
      }
      
      return session.user
    } catch (error) {
      throw AppError.from(error, 'Failed to get current user')
    }
  }

  /**
   * Get user profile by ID
   */
  async getUserProfile(userId?: string): Promise<UserProfile | null> {
    try {
      // If no userId is provided, get the current user's profile
      if (!userId) {
        const user = await this.getCurrentUser()
        if (!user) return null
        userId = user.id
      }

      const { data, error } = await this.supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) throw AppError.auth(error.message, { cause: error })

      return data
    } catch (error) {
      throw AppError.from(error, 'Failed to fetch user profile')
    }
  }

  /**
   * Update user profile
   */
  async updateUserProfile(userId: string, profile: Partial<UserProfile>): Promise<boolean> {
    try {
      // Sanitize input data
      const sanitizedProfile = this.sanitizeProfileData(profile)
      
      const { error } = await this.supabase
        .from('profiles')
        .update(sanitizedProfile)
        .eq('id', userId)

      if (error) throw AppError.auth(error.message, { cause: error })

      return true
    } catch (error) {
      throw AppError.from(error, 'Failed to update user profile')
    }
  }

  /**
   * Sanitize profile data before saving to database
   */
  private sanitizeProfileData(profile: Partial<UserProfile>): Partial<UserProfile> {
    const sanitized: Partial<UserProfile> = {}
    
    // Only copy allowed fields and validate data
    if (profile.full_name) sanitized.full_name = profile.full_name.trim().slice(0, 100)
    if (profile.username) sanitized.username = profile.username.trim().slice(0, 30)
    if (profile.bio) sanitized.bio = profile.bio.trim().slice(0, 500)
    if (profile.location) sanitized.location = profile.location.trim().slice(0, 100)
    if (profile.website) sanitized.website = profile.website.trim().slice(0, 200)
    if (profile.skills) sanitized.skills = profile.skills.map(skill => skill.trim()).filter(Boolean)
    
    return sanitized
  }

  /**
   * Update user avatar
   */
  async updateUserAvatar(userId: string, file: File): Promise<string | null> {
    try {
      // Validate file
      if (file.size > 5 * 1024 * 1024) {
        throw AppError.validation('Avatar size cannot exceed 5MB')
      }
      
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        throw AppError.validation('Avatar must be in JPEG, PNG, or WebP format')
      }

      // Upload avatar to storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${userId}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `avatars/${fileName}`

      const { error: uploadError } = await this.supabase.storage
        .from('user-content')
        .upload(filePath, file)

      if (uploadError) throw AppError.auth(uploadError.message, { cause: uploadError })

      // Get public URL
      const { data: { publicUrl } } = this.supabase.storage
        .from('user-content')
        .getPublicUrl(filePath)

      // Update profile with new avatar URL
      const { error: updateError } = await this.supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', userId)

      if (updateError) throw AppError.auth(updateError.message, { cause: updateError })

      return publicUrl
    } catch (error) {
      throw AppError.from(error, 'Failed to update avatar')
    }
  }

  /**
   * Sign in with email and password
   */
  async signIn({ email, password }) {
    try {
      // Check if the user is locked out
      this.checkLoginLockout(email)
      
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        // Increment failed login attempts
        this.incrementLoginAttempts(email)
        throw AppError.auth(error.message, { cause: error })
      }

      // Reset login attempts on successful login
      this.resetLoginAttempts(email)
      
      return data
    } catch (error) {
      throw AppError.from(error, 'Failed to sign in')
    }
  }

  /**
   * Check if the email is currently locked out due to too many failed attempts
   */
  private checkLoginLockout(email: string): void {
    const lowercaseEmail = email.toLowerCase()
    const attempts = AuthService.loginAttempts.get(lowercaseEmail)
    
    if (!attempts) return
    
    const { count, lastAttempt } = attempts
    const now = Date.now()
    
    // If user has exceeded max attempts and is still in lockout period
    if (count >= AuthService.MAX_LOGIN_ATTEMPTS && 
        now - lastAttempt < AuthService.LOCKOUT_PERIOD) {
      const minutesLeft = Math.ceil((AuthService.LOCKOUT_PERIOD - (now - lastAttempt)) / 60000)
      throw AppError.auth(`Too many failed login attempts. Please try again in ${minutesLeft} minutes.`)
    }
    
    // If lockout period has expired, reset attempts
    if (now - lastAttempt >= AuthService.LOCKOUT_PERIOD) {
      this.resetLoginAttempts(email)
    }
  }
  
  /**
   * Increment failed login attempts for an email
   */
  private incrementLoginAttempts(email: string): void {
    const lowercaseEmail = email.toLowerCase()
    const attempts = AuthService.loginAttempts.get(lowercaseEmail) || { count: 0, lastAttempt: 0 }
    
    AuthService.loginAttempts.set(lowercaseEmail, {
      count: attempts.count + 1,
      lastAttempt: Date.now()
    })
  }
  
  /**
   * Reset login attempts for an email
   */
  private resetLoginAttempts(email: string): void {
    const lowercaseEmail = email.toLowerCase()
    AuthService.loginAttempts.delete(lowercaseEmail)
  }

  /**
   * Sign up with email, password, and full name
   */
  async signUp({ email, password, fullName }) {
    try {
      const { data, error } = await this.supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      })

      if (error) throw AppError.auth(error.message, { cause: error })
      
      return data
    } catch (error) {
      throw AppError.from(error, 'Failed to sign up')
    }
  }

  /**
   * Sign out the current user
   */
  async signOut() {
    try {
      const { error } = await this.supabase.auth.signOut()
      
      if (error) throw AppError.auth(error.message, { cause: error })
      
      return true
    } catch (error) {
      throw AppError.from(error, 'Failed to sign out')
    }
  }

  /**
   * Reset password for an email
   */
  async resetPassword(email) {
    try {
      const { error } = await this.supabase.auth.resetPasswordForEmail(email)
      
      if (error) throw AppError.auth(error.message, { cause: error })
      
      return true
    } catch (error) {
      throw AppError.from(error, 'Failed to reset password')
    }
  }

  /**
   * Update user password
   */
  async updatePassword(newPassword: string) {
    try {
      const { error } = await this.supabase.auth.updateUser({
        password: newPassword,
      })
      
      if (error) throw AppError.auth(error.message, { cause: error })
      
      return true
    } catch (error) {
      throw AppError.from(error, 'Failed to update password')
    }
  }

  /**
   * Listen for auth state changes
   */
  onAuthStateChange(callback) {
    return this.supabase.auth.onAuthStateChange(callback);
  }
} 