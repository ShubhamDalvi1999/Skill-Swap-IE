import { describe, it, expect } from 'vitest'
import { signInSchema, signUpSchema, resetPasswordSchema } from '@/schemas/authSchemas'

describe('Authentication Schemas', () => {
  describe('signInSchema', () => {
    it('should validate valid sign in data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'Password123!',
      }
      
      const result = signInSchema.safeParse(validData)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toEqual(validData)
      }
    })
    
    it('should reject invalid email', () => {
      const invalidData = {
        email: 'not-an-email',
        password: 'Password123!',
      }
      
      const result = signInSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        const errors = result.error.flatten().fieldErrors
        expect(errors.email).toBeDefined()
        expect(errors.email?.[0]).toContain('valid email')
      }
    })
    
    it('should reject too short password', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'short',
      }
      
      const result = signInSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        const errors = result.error.flatten().fieldErrors
        expect(errors.password).toBeDefined()
        expect(errors.password?.[0]).toContain('at least 8 characters')
      }
    })
  })
  
  describe('signUpSchema', () => {
    it('should validate valid sign up data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
        fullName: 'John Doe',
        agreeToTerms: true,
      }
      
      const result = signUpSchema.safeParse(validData)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toEqual(validData)
      }
    })
    
    it('should reject when passwords do not match', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'Password123!',
        confirmPassword: 'DifferentPassword456!',
        fullName: 'John Doe',
        agreeToTerms: true,
      }
      
      const result = signUpSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        const errors = result.error.flatten().fieldErrors
        expect(errors.confirmPassword).toBeDefined()
        expect(errors.confirmPassword?.[0]).toContain('match')
      }
    })
    
    it('should reject when terms are not agreed to', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
        fullName: 'John Doe',
        agreeToTerms: false,
      }
      
      const result = signUpSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        const errors = result.error.flatten().fieldErrors
        expect(errors.agreeToTerms).toBeDefined()
      }
    })
    
    it('should reject when fullName is too short', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
        fullName: 'Jo',
        agreeToTerms: true,
      }
      
      const result = signUpSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        const errors = result.error.flatten().fieldErrors
        expect(errors.fullName).toBeDefined()
        expect(errors.fullName?.[0]).toContain('at least 3 characters')
      }
    })
  })
  
  describe('resetPasswordSchema', () => {
    it('should validate valid password reset data', () => {
      const validData = {
        password: 'NewPassword123!',
        confirmPassword: 'NewPassword123!',
      }
      
      const result = resetPasswordSchema.safeParse(validData)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toEqual(validData)
      }
    })
    
    it('should reject when passwords do not match', () => {
      const invalidData = {
        password: 'Password123!',
        confirmPassword: 'DifferentPassword456!',
      }
      
      const result = resetPasswordSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        const errors = result.error.flatten().fieldErrors
        expect(errors.confirmPassword).toBeDefined()
        expect(errors.confirmPassword?.[0]).toContain('match')
      }
    })
    
    it('should reject weak passwords', () => {
      const invalidData = {
        password: 'password',
        confirmPassword: 'password',
      }
      
      const result = resetPasswordSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        const errors = result.error.flatten().fieldErrors
        expect(errors.password).toBeDefined()
      }
    })
  })
}) 