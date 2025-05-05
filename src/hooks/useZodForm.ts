import { useState } from 'react'
import { useForm, UseFormProps, FieldValues, UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useErrorToast } from './useErrorToast'
import { ErrorHandler } from '@/lib/errors/errorHandler'

export type UseZodFormReturn<T extends FieldValues> = UseFormReturn<T> & {
  isSubmitting: boolean
  formError: string | null
  setFormError: (error: string | null) => void
  handleSubmitWithErrorHandling: (
    onSuccess: (data: T) => Promise<void> | void,
    formName?: string
  ) => (e?: React.BaseSyntheticEvent) => Promise<void>
}

/**
 * A hook that enhances react-hook-form with Zod validation and error handling
 */
export function useZodForm<TSchema extends z.ZodType<any, any, any>>(
  schema: TSchema,
  formOptions?: Omit<UseFormProps<z.infer<TSchema>>, 'resolver'>
): UseZodFormReturn<z.infer<TSchema>> {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const errorToast = useErrorToast()
  
  // Use zodResolver to integrate zod with react-hook-form
  const form = useForm<z.infer<TSchema>>({
    ...formOptions,
    resolver: zodResolver(schema),
  })

  // Enhanced submit handler with error handling
  const handleSubmitWithErrorHandling = (
    onSuccess: (data: z.infer<TSchema>) => Promise<void> | void,
    formName = 'form'
  ) => {
    return form.handleSubmit(async (data) => {
      setIsSubmitting(true)
      setFormError(null)
      
      try {
        await onSuccess(data)
      } catch (error) {
        // Handle validation errors
        if (error instanceof z.ZodError) {
          const fieldErrors = ErrorHandler.handleValidationError(error)
          
          // Set errors on form fields
          Object.entries(fieldErrors).forEach(([field, errorMessage]) => {
            form.setError(field as any, { 
              type: 'manual', 
              message: errorMessage 
            })
          })
          
          errorToast.showValidationError('Please fix the form errors', formName)
        } else {
          // Handle general errors
          const errorMessage = ErrorHandler.getUserFriendlyMessage(error)
          setFormError(errorMessage)
          errorToast.showError(errorMessage)
          
          console.error(`Form submission error (${formName}):`, error)
        }
      } finally {
        setIsSubmitting(false)
      }
    })
  }

  return {
    ...form,
    isSubmitting,
    formError,
    setFormError,
    handleSubmitWithErrorHandling
  }
}