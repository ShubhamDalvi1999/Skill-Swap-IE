'use client'

import { useState } from 'react'
import { signIn, signUp, resetPassword } from '../../lib/supabase'

/**
 * A flexible authentication form component that handles sign in, sign up, and password reset.
 */
export default function AuthForm({ mode = 'signin', onSuccess, onError, redirectTo }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [formMode, setFormMode] = useState(mode)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      if (formMode === 'signup') {
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match')
        }

        const userData = {
          name,
        }

        const data = await signUp(email, password, userData)
        setMessage('Sign up successful! Please check your email for verification.')
        onSuccess && onSuccess(data)
      } else if (formMode === 'signin') {
        const data = await signIn(email, password)
        setMessage('Sign in successful!')
        onSuccess && onSuccess(data)

        if (redirectTo) {
          window.location.href = redirectTo
        }
      } else if (formMode === 'reset') {
        await resetPassword(email)
        setMessage('Password reset link sent! Please check your email.')
      }
    } catch (err) {
      setError(err.message || 'An error occurred')
      onError && onError(err)
    } finally {
      setLoading(false)
    }
  }

  const toggleMode = (newMode) => {
    setFormMode(newMode)
    setError('')
    setMessage('')
  }

  return (
    <div className="auth-form-container">
      <h2 className="auth-title">
        {formMode === 'signin' && 'Sign In'}
        {formMode === 'signup' && 'Create Account'}
        {formMode === 'reset' && 'Reset Password'}
      </h2>

      {error && <div className="auth-error">{error}</div>}
      {message && <div className="auth-message">{message}</div>}

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {(formMode === 'signin' || formMode === 'signup') && (
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        )}

        {formMode === 'signup' && (
          <>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </>
        )}

        <button type="submit" className="auth-button" disabled={loading}>
          {loading ? 'Processing...' : (
            formMode === 'signin' ? 'Sign In' :
            formMode === 'signup' ? 'Sign Up' :
            'Send Reset Link'
          )}
        </button>
      </form>

      <div className="auth-options">
        {formMode === 'signin' && (
          <>
            <button onClick={() => toggleMode('signup')} className="auth-link">
              Need an account? Sign up
            </button>
            <button onClick={() => toggleMode('reset')} className="auth-link">
              Forgot your password?
            </button>
          </>
        )}

        {formMode === 'signup' && (
          <button onClick={() => toggleMode('signin')} className="auth-link">
            Already have an account? Sign in
          </button>
        )}

        {formMode === 'reset' && (
          <button onClick={() => toggleMode('signin')} className="auth-link">
            Back to sign in
          </button>
        )}
      </div>
    </div>
  )
} 