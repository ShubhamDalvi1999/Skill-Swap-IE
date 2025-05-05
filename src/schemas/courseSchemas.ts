// @ts-nocheck
import { z } from 'zod';

/**
 * Schema for the course search form
 */
export const courseSearchSchema = z.object({
  query: z.string().optional(),
  category: z.string().optional(),
  level: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  sortBy: z.enum(['newest', 'popular', 'rating']).optional(),
});

export type CourseSearchValues = z.infer<typeof courseSearchSchema>;

/**
 * Schema for course review submission
 */
export const courseReviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().min(10, {
    message: 'Review comment must be at least 10 characters',
  }).max(500, {
    message: 'Review comment cannot exceed 500 characters',
  }),
});

export type CourseReviewValues = z.infer<typeof courseReviewSchema>;

/**
 * Schema for lesson completion tracking
 */
export const lessonProgressSchema = z.object({
  lessonId: z.string().uuid(),
  completed: z.boolean(),
  timeSpent: z.number().min(0),
  quizResults: z.array(
    z.object({
      questionId: z.string(),
      answer: z.string(),
      correct: z.boolean(),
    })
  ).optional(),
});

export type LessonProgressValues = z.infer<typeof lessonProgressSchema>;

/**
 * Schema for course enrollment
 */
export const courseEnrollmentSchema = z.object({
  courseId: z.string().uuid(),
  userId: z.string().uuid(),
  enrollmentDate: z.date().default(() => new Date()),
  paymentMethod: z.enum(['credit_card', 'paypal', 'free']).optional(),
  couponCode: z.string().optional(),
});

export type CourseEnrollmentValues = z.infer<typeof courseEnrollmentSchema>; 