// @ts-nocheck
import { z } from 'zod';

// Common fields that are reused across schemas
const emailField = z.string()
  .min(1, { message: 'Email is required' })
  .email({
    message: 'Please enter a valid email address',
  });

const passwordField = z
  .string()
  .min(8, {
    message: 'Password must be at least 8 characters long',
  })
  .regex(/[A-Z]/, {
    message: 'Password must contain at least one uppercase letter',
  })
  .regex(/[a-z]/, {
    message: 'Password must contain at least one lowercase letter',
  })
  .regex(/[0-9]/, {
    message: 'Password must contain at least one number',
  });

const fullNameField = z
  .string()
  .min(2, {
    message: 'Full name must be at least 2 characters long',
  })
  .max(100, {
    message: 'Full name cannot exceed 100 characters',
  });

/**
 * Schema for the sign-in form
 */
export const signInSchema = z.object({
  email: emailField,
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

export type SignInFormValues = z.infer<typeof signInSchema>;

/**
 * Schema for the sign-up form
 */
export const signUpSchema = z.object({
  fullName: fullNameField,
  email: emailField,
  password: passwordField,
  confirmPassword: z.string(),
  acceptTerms: z.literal(true, {
    errorMap: () => ({
      message: 'You must accept the terms and conditions',
    }),
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export type SignUpFormValues = z.infer<typeof signUpSchema>;

/**
 * Schema for the password reset request form
 */
export const resetPasswordRequestSchema = z.object({
  email: emailField,
});

export type ResetPasswordRequestValues = z.infer<typeof resetPasswordRequestSchema>;

/**
 * Schema for the password reset form (after receiving reset token)
 */
export const resetPasswordSchema = z.object({
  password: passwordField,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

/**
 * Schema for the update profile form
 */
export const updateProfileSchema = z.object({
  fullName: fullNameField,
  username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/, {
    message: 'Username can only contain letters, numbers, and underscores',
  }).optional(),
  bio: z.string().max(500, {
    message: 'Bio cannot exceed 500 characters',
  }).optional(),
  location: z.string().max(100).optional(),
  website: z.string().url({ message: 'Please enter a valid URL' }).optional().or(z.literal('')),
  skills: z.array(z.string()).optional(),
});

export type UpdateProfileValues = z.infer<typeof updateProfileSchema>; 