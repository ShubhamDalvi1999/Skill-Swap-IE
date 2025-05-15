// @ts-nocheck
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createBrowserClient } from '@supabase/ssr'
import { Button as MovingButton } from '@/components/ui/moving-border'
import { signUpSchema } from '@/schemas/authSchemas'

export default function SignUp() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [generalError, setGeneralError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const validateForm = () => {
    // Basic validation without Zod
    const newErrors: Record<string, string> = {};
    
    // Full name validation
    if (!formData.name) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.name.length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters long';
    } else if (formData.name.length > 100) {
      newErrors.fullName = 'Full name cannot exceed 100 characters';
    }
    
    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter';
    } else if (!/[a-z]/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one lowercase letter';
    } else if (!/[0-9]/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one number';
    }
    
    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    // Terms validation
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setGeneralError(null)
    setErrors({})
    
    // Validate form before submitting
    if (!validateForm()) {
      return;
    }
    
    setLoading(true)

    try {
      // Sign up the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.name,
          },
          emailRedirectTo: `${window.location.origin}/auth/verify-email`,
        },
      })

      if (authError) {
        // Handle specific Supabase errors
        if (authError.message.includes("Email address") && authError.message.includes("invalid")) {
          setErrors({ email: "Please enter a valid email address" });
        } else {
          setGeneralError(authError.message);
        }
        return;
      }

      // If signup successful, create profile in database using Prisma
      if (authData?.user) {
        try {
          // Import prisma client dynamically to avoid circular dependencies
          const { default: prisma } = await import('@/lib/prisma')
          
          await prisma.profile.create({
            data: {
              id: authData.user.id,
              email: authData.user.email!,
              fullName: formData.name,
              role: 'student',
              joinedDate: new Date(),
              lastSeen: new Date(),
              skills: [],
            }
          })
        } catch (profileError) {
          console.error('Error creating profile with Prisma:', profileError)
          setGeneralError('Failed to create user profile')
          return
        }
      }

      // Show verification message
      router.push('/auth/verify-email?status=check-email')
    } catch (error) {
      setGeneralError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full space-y-8 p-8 bg-secondary rounded-xl">
        <div>
          <h2 className="text-2xl font-bold text-center">Create your account</h2>
          <p className="mt-2 text-sm text-gray-400 text-center">
            Already have an account?{' '}
            <Link href="/auth/signin" className="text-primary hover:text-primary/80">
              Sign in
            </Link>
          </p>
        </div>

        <form onSubmit={handleSignUp} className="mt-8 space-y-6">
          {generalError && (
            <div className="bg-red-500/10 text-red-500 p-4 rounded-lg text-sm">
              {generalError}
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`mt-1 block w-full bg-gray-800 border ${errors.fullName ? 'border-red-500' : 'border-gray-700'} rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary`}
              placeholder="Enter your full name"
            />
            {errors.fullName && (
              <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Email address
            </label>
            <input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={`mt-1 block w-full bg-gray-800 border ${errors.email ? 'border-red-500' : 'border-gray-700'} rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary`}
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className={`mt-1 block w-full bg-gray-800 border ${errors.password ? 'border-red-500' : 'border-gray-700'} rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary`}
              placeholder="Create a password"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              required
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className={`mt-1 block w-full bg-gray-800 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-700'} rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary`}
              placeholder="Confirm your password"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
            )}
          </div>

          <div className="flex items-center">
            <input
              id="acceptTerms"
              type="checkbox"
              checked={formData.acceptTerms}
              onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
              className={`h-4 w-4 rounded border-gray-700 text-primary focus:ring-primary ${errors.acceptTerms ? 'border-red-500' : ''}`}
            />
            <label htmlFor="acceptTerms" className="ml-2 block text-sm text-gray-300">
              I agree to the Terms of Service and Privacy Policy
            </label>
          </div>
          {errors.acceptTerms && (
            <p className="text-sm text-red-500">{errors.acceptTerms}</p>
          )}

          <MovingButton 
            type="submit" 
            className="w-full bg-secondary-800 hover:bg-secondary-700"
            containerClassName="w-full" 
            borderClassName="opacity-40" 
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Sign up'}
          </MovingButton>
        </form>

        <div className="mt-4 text-sm text-gray-400 text-center">
          By signing up, you agree to our{' '}
          <Link href="/terms" className="text-primary hover:text-primary/80">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="text-primary hover:text-primary/80">
            Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  )
} 