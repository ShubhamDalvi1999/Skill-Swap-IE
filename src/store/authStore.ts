import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AuthService } from '@/services/authService'
import { UserProfile } from '@/types/user'
import { AppError } from '@/lib/errors/AppError'

interface AuthState {
  isAuthenticated: boolean
  isLoading: boolean
  user: any | null
  userProfile: UserProfile | null
  authError: string | null
  
  // Actions
  initialize: () => Promise<void>
  login: (email: string, password: string) => Promise<boolean>
  signup: (email: string, password: string, fullName: string) => Promise<boolean>
  logout: () => Promise<void>
  clearAuthError: () => void
  updateProfile: (profile: Partial<UserProfile>) => Promise<boolean>
  refreshUserProfile: () => Promise<void>
}

const authService = new AuthService()

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      isLoading: true,
      user: null,
      userProfile: null,
      authError: null,

      initialize: async () => {
        set({ isLoading: true })
        try {
          const user = await authService.getCurrentUser()
          
          if (user) {
            const userProfile = await authService.getUserProfile(user.id)
            set({ 
              isAuthenticated: true, 
              user,
              userProfile,
              isLoading: false 
            })
          } else {
            set({ 
              isAuthenticated: false, 
              user: null,
              userProfile: null,
              isLoading: false 
            })
          }
        } catch (error) {
          console.error('Failed to initialize auth store:', error)
          set({ 
            isAuthenticated: false, 
            user: null, 
            userProfile: null,
            authError: AppError.from(error).message,
            isLoading: false 
          })
        }
      },

      login: async (email, password) => {
        set({ isLoading: true, authError: null })
        try {
          const { user } = await authService.signIn({ email, password })
          
          if (user) {
            const userProfile = await authService.getUserProfile(user.id)
            set({ 
              isAuthenticated: true, 
              user,
              userProfile,
              isLoading: false 
            })
            return true
          }
          
          set({ isLoading: false })
          return false
        } catch (error) {
          set({ 
            isAuthenticated: false,
            authError: AppError.from(error).message,
            isLoading: false 
          })
          return false
        }
      },

      signup: async (email, password, fullName) => {
        set({ isLoading: true, authError: null })
        try {
          const { user } = await authService.signUp({ 
            email, 
            password, 
            fullName 
          })
          
          if (user) {
            // For new sign ups, we don't immediately authenticate them
            // as they may need to verify their email first depending on settings
            set({ isLoading: false })
            return true
          }
          
          set({ isLoading: false })
          return false
        } catch (error) {
          set({ 
            authError: AppError.from(error).message,
            isLoading: false 
          })
          return false
        }
      },

      logout: async () => {
        set({ isLoading: true })
        try {
          await authService.signOut()
          set({ 
            isAuthenticated: false, 
            user: null,
            userProfile: null,
            isLoading: false 
          })
        } catch (error) {
          set({ 
            authError: AppError.from(error).message,
            isLoading: false 
          })
        }
      },

      clearAuthError: () => {
        set({ authError: null })
      },

      updateProfile: async (profile) => {
        const { user } = get()
        if (!user) return false

        try {
          const success = await authService.updateUserProfile(user.id, profile)
          
          if (success) {
            // Refresh user profile
            await get().refreshUserProfile()
          }
          
          return success
        } catch (error) {
          set({ authError: AppError.from(error).message })
          return false
        }
      },

      refreshUserProfile: async () => {
        const { user } = get()
        if (!user) return

        try {
          const userProfile = await authService.getUserProfile(user.id)
          if (userProfile) {
            set({ userProfile })
          }
        } catch (error) {
          console.error('Failed to refresh user profile:', error)
        }
      }
    }),
    {
      name: 'auth-storage',
      // Only persist the authentication state, not the full user data
      partialize: (state) => ({ 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
) 