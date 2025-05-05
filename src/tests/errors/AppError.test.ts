import { describe, it, expect } from 'vitest'
import { AppError } from '@/lib/errors/AppError'

describe('AppError', () => {
  it('should create a basic error', () => {
    const error = new AppError('Test error')
    expect(error.message).toBe('Test error')
    expect(error.code).toBe('UNKNOWN_ERROR')
    expect(error.name).toBe('AppError')
  })

  it('should create an error with a specific code', () => {
    const error = new AppError('Test error', { code: 'TEST_ERROR' })
    expect(error.message).toBe('Test error')
    expect(error.code).toBe('TEST_ERROR')
  })

  it('should create an error with context', () => {
    const error = new AppError('Test error', { context: { foo: 'bar' } })
    expect(error.context).toEqual({ foo: 'bar' })
  })

  it('should create an error with a cause', () => {
    const cause = new Error('Original error')
    const error = new AppError('Test error', { cause })
    expect(error.cause).toBe(cause)
  })

  it('should create an authentication error', () => {
    const error = AppError.auth('Authentication failed')
    expect(error.message).toBe('Authentication failed')
    expect(error.code).toBe('AUTH_ERROR')
  })

  it('should create a validation error', () => {
    const error = AppError.validation('Validation failed')
    expect(error.message).toBe('Validation failed')
    expect(error.code).toBe('VALIDATION_ERROR')
  })

  it('should create a not found error', () => {
    const error = AppError.notFound('Resource not found')
    expect(error.message).toBe('Resource not found')
    expect(error.code).toBe('NOT_FOUND')
  })

  it('should create a server error', () => {
    const error = AppError.server('Server error')
    expect(error.message).toBe('Server error')
    expect(error.code).toBe('SERVER_ERROR')
  })

  it('should convert a regular Error to an AppError', () => {
    const originalError = new Error('Original error')
    const error = AppError.from(originalError)
    expect(error.message).toBe('Original error')
    expect(error.code).toBe('UNKNOWN_ERROR')
    expect(error.cause).toBe(originalError)
  })

  it('should convert a regular Error to an AppError with context', () => {
    const originalError = new Error('Original error')
    const error = AppError.from(originalError, 'Operation failed')
    expect(error.message).toBe('Operation failed')
    expect(error.code).toBe('UNKNOWN_ERROR')
    expect(error.cause).toBe(originalError)
  })

  it('should pass through an existing AppError', () => {
    const originalError = AppError.auth('Auth error')
    const error = AppError.from(originalError)
    expect(error).toBe(originalError)
  })
}) 