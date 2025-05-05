import { createBrowserClient } from '@supabase/ssr'
import { UserProfile } from '@/types/user'
import { AppError } from '@/lib/errors/AppError'
import { SignInFormValues, SignUpFormValues } from '@/schemas/authSchemas'

export class AuthService {
  private supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

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
  async signIn(formData: SignInFormValues) {
    try {
      const { email, password } = formData
      
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
  async signUp(formData: SignUpFormValues) {
    try {
      const { email, password, fullName } = formData
    
      const { data, error } = await this.supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        }
      })

      if (error) throw AppError.auth(error.message, { cause: error })

      // Create a profile for the new user using Prisma
      if (data.user) {
        try {
          // Import prisma client dynamically to avoid circular dependencies
          const { default: prisma } = await import('@/lib/prisma')
          
          await prisma.profile.create({
            data: {
              id: data.user.id,
              email: data.user.email!,
              fullName: fullName,
              role: 'student',
              joinedDate: new Date(),
              lastSeen: new Date(),
              skills: [],
            }
          })
        } catch (profileError) {
          console.error('Error creating profile with Prisma:', profileError)
          // Continue with the signup process even if profile creation fails
          // The profile will be created later when the user confirms their email
        }
      }

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
   * Send password reset email
   */
  async resetPassword(email: string) {
    try {
      const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      })
      
      if (error) throw AppError.auth(error.message, { cause: error })
      
      return true
    } catch (error) {
      throw AppError.from(error, 'Failed to send password reset email')
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
   * Set up an auth state change listener
   */
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return this.supabase.auth.onAuthStateChange(callback)
  }
} 