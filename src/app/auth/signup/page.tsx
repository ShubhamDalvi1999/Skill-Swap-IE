// @ts-nocheck
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createBrowserClient } from '@supabase/ssr'
import { Button as MovingButton } from '@/components/ui/moving-border'
import DynamicIcon from '@/components/ui/LucideIcon'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/Footer'
import { signUpSchema } from '@/schemas/authSchemas'

export default function SignUp() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
    marketingEmails: false
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [generalError, setGeneralError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
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
            marketing_emails: formData.marketingEmails
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
              email: authData.user.email ?? '',
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
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      <div className="flex-grow flex">
        {/* Left side - Illustration */}
        <div className="hidden lg:flex lg:w-1/2 bg-white items-center justify-end p-8">
          <div className="max-w-xl pr-8">
            <Image 
              src="/images/login-page-img.png" 
              alt="SkillSwap learning illustration" 
              width={650} 
              height={650}
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Right side - Sign up form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            <div className="text-center mb-10">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Sign up with email</h1>
              <p className="text-gray-600">Join our community of learners and educators</p>
            </div>
            
          {generalError && (
              <div className="bg-red-500/10 text-red-500 p-4 rounded-lg text-sm mb-6">
              {generalError}
            </div>
          )}

            <form onSubmit={handleSignUp} className="space-y-6">
          <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`block w-full px-4 py-3 bg-gray-50 border ${errors.fullName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
              placeholder="Enter your full name"
            />
            {errors.fullName && (
              <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>
            )}
          </div>

          <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email address
            </label>
            <input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`block w-full px-4 py-3 bg-gray-50 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className={`block w-full px-4 py-3 bg-gray-50 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
              placeholder="Create a password"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              required
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className={`block w-full px-4 py-3 bg-gray-50 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
              placeholder="Confirm your password"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
            )}
          </div>

              <div className="space-y-3">
                <div className="flex items-start">
                  <input
                    id="marketingEmails"
                    type="checkbox"
                    checked={formData.marketingEmails}
                    onChange={(e) => setFormData({ ...formData, marketingEmails: e.target.checked })}
                    className="h-4 w-4 mt-1 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <label htmlFor="marketingEmails" className="ml-2 block text-sm text-gray-600">
                    Send me special offers, personalized recommendations, and learning tips.
                  </label>
                </div>
                
                <div className="flex items-start">
            <input
              id="acceptTerms"
              type="checkbox"
                    required
              checked={formData.acceptTerms}
              onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
                    className={`h-4 w-4 mt-1 text-primary border-gray-300 rounded focus:ring-primary ${errors.acceptTerms ? 'border-red-500' : ''}`}
            />
                  <label htmlFor="acceptTerms" className="ml-2 block text-sm text-gray-600">
                    I agree to the{' '}
                    <Link href="/terms" className="text-primary hover:text-primary/80">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="text-primary hover:text-primary/80">
                      Privacy Policy
                    </Link>
            </label>
          </div>
          {errors.acceptTerms && (
            <p className="text-sm text-red-500">{errors.acceptTerms}</p>
          )}
              </div>

          <MovingButton 
            type="submit" 
                className="w-full bg-secondary-800 hover:bg-secondary-700 inline-flex items-center justify-center"
                containerClassName="w-full" 
                borderClassName="opacity-40" 
            disabled={loading}
          >
                {loading ? 'Creating account...' : 'Continue with email'}
                <DynamicIcon icon="email" className="ml-2 h-4 w-4" />
          </MovingButton>
              
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Other sign up options</span>
                  </div>
                </div>
                
                <div className="mt-6 grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center py-2.5 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    <svg className="h-5 w-5" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
                    </svg>
                  </button>
                  <button
                    type="button"
                    className="w-full inline-flex justify-center py-2.5 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    <svg className="h-5 w-5 text-[#1877F2]" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </button>
                  <button
                    type="button"
                    className="w-full inline-flex justify-center py-2.5 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    <svg className="h-5 w-5" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701z"/>
                    </svg>
                  </button>
                </div>
              </div>
        </form>

            <p className="mt-8 text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/auth/signin" className="font-medium text-primary hover:text-primary/80">
                Log in
          </Link>
            </p>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
} 