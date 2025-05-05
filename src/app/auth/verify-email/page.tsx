// @ts-nocheck
'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { Button } from '@/components/ui/button'

export default function VerifyEmail() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error' | 'check-email'>('loading')
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const status = searchParams.get('status')
    if (status === 'check-email') {
      setVerificationStatus('check-email')
      return
    }

    const verifyEmail = async () => {
      try {
        // Get the token from the URL
        const token = searchParams.get('token')
        const type = searchParams.get('type')

        if (!token || type !== 'email_verification') {
          setVerificationStatus('error')
          return
        }

        // Verify the email
        const { error } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: 'email',
        })

        if (error) {
          console.error('Verification error:', error)
          setVerificationStatus('error')
          return
        }

        setVerificationStatus('success')
      } catch (error) {
        console.error('Verification error:', error)
        setVerificationStatus('error')
      }
    }

    verifyEmail()
  }, [searchParams, supabase.auth])

  const handleContinue = () => {
    router.push('/dashboard')
  }

  const handleRetry = () => {
    router.push('/auth/signin')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full space-y-8 p-8 bg-secondary rounded-xl">
        {verificationStatus === 'loading' && (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Verifying your email...</h2>
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary mx-auto"></div>
          </div>
        )}

        {verificationStatus === 'check-email' && (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Check your email</h2>
            <p className="text-gray-400 mb-8">
              We've sent you an email with a verification link. Please check your inbox and click the link to verify your account.
            </p>
            <Button onClick={handleRetry} variant="outline" className="w-full">
              Return to Sign In
            </Button>
          </div>
        )}

        {verificationStatus === 'success' && (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Email Verified!</h2>
            <p className="text-gray-400 mb-8">
              Your email has been successfully verified. You can now access all features of the platform.
            </p>
            <Button onClick={handleContinue} className="w-full">
              Continue to Dashboard
            </Button>
          </div>
        )}

        {verificationStatus === 'error' && (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Verification Failed</h2>
            <p className="text-gray-400 mb-8">
              We couldn't verify your email. The link might be expired or invalid.
            </p>
            <Button onClick={handleRetry} variant="outline" className="w-full">
              Return to Sign In
            </Button>
          </div>
        )}
      </div>
    </div>
  )
} 