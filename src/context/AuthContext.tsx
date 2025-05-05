// @ts-nocheck
'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { AuthService } from '@/services/authService'
import type { UserProfile } from '@/types/user'

interface User {
  id: string
  email?: string
  [key: string]: any
}

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  isLoading: boolean
  error: string | null
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, fullName: string) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updateProfile: (data: Partial<UserProfile>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const authService = new AuthService()

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true)
        
        // Get current user
        const currentUser = await authService.getCurrentUser()
        setUser(currentUser)
        
        // If user is logged in, get their profile
        if (currentUser) {
          const userProfile = await authService.getUserProfile(currentUser.id)
          setProfile(userProfile)
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
        setError('Failed to initialize authentication')
      } finally {
        setIsLoading(false)
      }
    }
    
    initializeAuth()
    
    // Set up auth state change listener
    const { data: { subscription } } = authService.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user)
          const userProfile = await authService.getUserProfile(session.user.id)
          setProfile(userProfile)
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
          setProfile(null)
        }
      }
    )
    
    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      setError(null)
      
      const { session } = await authService.signIn(email, password)
      
      if (session?.user) {
        setUser(session.user)
        const userProfile = await authService.getUserProfile(session.user.id)
        setProfile(userProfile)
      }
    } catch (error: any) {
      console.error('Error signing in:', error)
      setError(error.message || 'Failed to sign in')
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      setIsLoading(true)
      setError(null)
      
      await authService.signUp(email, password, fullName)
      
      // User will need to verify email before signing in
    } catch (error: any) {
      console.error('Error signing up:', error)
      setError(error.message || 'Failed to sign up')
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      await authService.signOut()
      
      setUser(null)
      setProfile(null)
    } catch (error: any) {
      console.error('Error signing out:', error)
      setError(error.message || 'Failed to sign out')
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const resetPassword = async (email: string) => {
    try {
      setIsLoading(true)
      setError(null)
      
      await authService.resetPassword(email)
    } catch (error: any) {
      console.error('Error resetting password:', error)
      setError(error.message || 'Failed to reset password')
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const updateProfile = async (data: Partial<UserProfile>) => {
    try {
      setIsLoading(true)
      setError(null)
      
      if (!user) {
        throw new Error('User not authenticated')
      }
      
      await authService.updateUserProfile(user.id, data)
      
      // Refresh profile data
      const updatedProfile = await authService.getUserProfile(user.id)
      setProfile(updatedProfile)
    } catch (error: any) {
      console.error('Error updating profile:', error)
      setError(error.message || 'Failed to update profile')
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const value = {
    user,
    profile,
    isLoading,
    error,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
} 