import { createBrowserClient } from '@supabase/ssr'
import { AppError } from '@/lib/errors/AppError'

// This would be replaced with actual Stripe client in a production app
// import { loadStripe } from '@stripe/stripe-js'
// const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface PaymentIntent {
  id: string
  clientSecret: string
  amount: number
  status: string
  created: number
}

interface CheckoutSession {
  id: string
  url: string
}

interface CouponValidation {
  valid: boolean
  discountPercentage: number
  discountAmount: number
  finalPrice: number
  message: string
}

/**
 * Service for handling payment operations
 */
export class PaymentService {
  private supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  /**
   * Create a payment intent for a course purchase
   */
  async createPaymentIntent(courseId: string, userId: string): Promise<PaymentIntent> {
    try {
      // In a real implementation, this would call a Supabase Edge Function
      // that creates a Stripe Payment Intent on the server
      const { data, error } = await this.supabase.functions.invoke('create-payment-intent', {
        body: {
          courseId,
          userId,
        },
      })

      if (error) throw AppError.server(error.message, { cause: error })
      if (!data) throw AppError.server('Failed to create payment intent')

      return data
    } catch (error) {
      throw AppError.from(error, 'Failed to create payment intent')
    }
  }

  /**
   * Create a checkout session for a course purchase
   */
  async createCheckoutSession(courseId: string, userId: string, couponCode?: string): Promise<CheckoutSession> {
    try {
      // In a real implementation, this would call a Supabase Edge Function
      // that creates a Stripe Checkout Session on the server
      const { data, error } = await this.supabase.functions.invoke('create-checkout-session', {
        body: {
          courseId,
          userId,
          couponCode,
        },
      })

      if (error) throw AppError.server(error.message, { cause: error })
      if (!data) throw AppError.server('Failed to create checkout session')

      return data
    } catch (error) {
      throw AppError.from(error, 'Failed to create checkout session')
    }
  }

  /**
   * Validate a coupon code for a course
   */
  async validateCoupon(courseId: string, couponCode: string): Promise<CouponValidation> {
    try {
      // For demonstration, we're mocking this call
      // In a real app, this would check against a database of valid coupons
      
      if (!couponCode.trim()) {
        return {
          valid: false,
          discountPercentage: 0,
          discountAmount: 0,
          finalPrice: 0, // We don't know the price yet
          message: 'No coupon code provided',
        }
      }

      // Get the course price first
      const { data: course, error: courseError } = await this.supabase
        .from('courses')
        .select('price')
        .eq('id', courseId)
        .single()

      if (courseError) throw AppError.server(courseError.message, { cause: courseError })
      if (!course) throw AppError.notFound(`Course with ID ${courseId} not found`)

      const price = course.price

      // Check if the coupon exists and is valid
      const { data: coupon, error: couponError } = await this.supabase
        .from('coupons')
        .select('*')
        .eq('code', couponCode.toUpperCase())
        .eq('is_active', true)
        .lte('valid_from', new Date().toISOString())
        .gte('valid_until', new Date().toISOString())
        .maybeSingle()

      if (couponError) throw AppError.server(couponError.message, { cause: couponError })

      if (!coupon) {
        return {
          valid: false,
          discountPercentage: 0,
          discountAmount: 0,
          finalPrice: price,
          message: 'Invalid or expired coupon code',
        }
      }

      // Check if the coupon applies to this course
      if (coupon.course_ids && coupon.course_ids.length > 0 && !coupon.course_ids.includes(courseId)) {
        return {
          valid: false,
          discountPercentage: 0,
          discountAmount: 0,
          finalPrice: price,
          message: 'This coupon is not valid for this course',
        }
      }

      // Calculate the discount
      let discountAmount = 0
      if (coupon.discount_type === 'percentage') {
        discountAmount = (price * coupon.discount_value) / 100
      } else {
        discountAmount = Math.min(coupon.discount_value, price)
      }

      const finalPrice = Math.max(0, price - discountAmount)
      const discountPercentage = price > 0 ? (discountAmount / price) * 100 : 0

      return {
        valid: true,
        discountPercentage,
        discountAmount,
        finalPrice,
        message: `Coupon applied: ${coupon.discount_type === 'percentage' 
          ? `${coupon.discount_value}% off` 
          : `$${coupon.discount_value} off`}`,
      }
    } catch (error) {
      throw AppError.from(error, 'Failed to validate coupon')
    }
  }

  /**
   * Get payment methods for a user
   */
  async getPaymentMethods(userId: string): Promise<any[]> {
    try {
      // In a real implementation, this would call Stripe's API to get saved payment methods
      // For now, we'll return mock data
      return [
        {
          id: 'pm_mock_card_1',
          type: 'card',
          card: {
            brand: 'visa',
            last4: '4242',
            exp_month: 12,
            exp_year: 2024,
          },
          billing_details: {
            name: 'John Doe',
          },
          created: Date.now() / 1000,
        },
      ]
    } catch (error) {
      throw AppError.from(error, 'Failed to get payment methods')
    }
  }

  /**
   * Process a payment
   * This is a mock implementation that would use Stripe in production
   */
  async processPayment(paymentMethodId: string, paymentIntentId: string): Promise<{ success: boolean; status: string }> {
    try {
      // In a real implementation, this would call a Supabase Edge Function
      // that confirms the payment intent with Stripe
      const { data, error } = await this.supabase.functions.invoke('confirm-payment', {
        body: {
          paymentMethodId,
          paymentIntentId,
        },
      })

      if (error) throw AppError.server(error.message, { cause: error })
      if (!data) throw AppError.server('Failed to process payment')

      return data
    } catch (error) {
      throw AppError.from(error, 'Failed to process payment')
    }
  }

  /**
   * Get order history for a user
   */
  async getOrderHistory(userId: string): Promise<any[]> {
    try {
      const { data, error } = await this.supabase
        .from('orders')
        .select(`
          id, 
          amount, 
          status, 
          created_at,
          courses (
            id, 
            title, 
            thumbnail
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw AppError.server(error.message, { cause: error })

      return data || []
    } catch (error) {
      throw AppError.from(error, 'Failed to get order history')
    }
  }
} 