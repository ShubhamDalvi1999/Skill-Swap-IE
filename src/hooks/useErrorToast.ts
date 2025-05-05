// @ts-nocheck
'use client';

import { useToastActions } from '@/components/shared/ToastProvider';
import { ErrorHandler } from '@/lib/errors/errorHandler';
import { AppError } from '@/lib/errors/AppError';

/**
 * Hook for displaying error messages in toasts
 * Uses the ErrorHandler to generate user-friendly messages
 */
export function useErrorToast() {
  const toast = useToastActions();

  /**
   * Show an error toast with a user-friendly message
   */
  const showError = (error: unknown, title = 'Error') => {
    // Use the getUserFriendlyMessage method if it exists, otherwise create a generic message
    const message = ErrorHandler.getUserFriendlyMessage 
      ? ErrorHandler.getUserFriendlyMessage(error)
      : AppError.from(error).message || 'An unexpected error occurred';
    
    toast.error(title, message);
  };

  /**
   * Show an API error toast
   */
  const showApiError = (error: unknown, context: string) => {
    const { message } = ErrorHandler.handleApiError(error, context);
    toast.error('Operation Failed', message);
  };

  /**
   * Show a validation error toast
   */
  const showValidationError = (error: unknown, formName: string) => {
    const { message } = ErrorHandler.handleValidationError(error, formName);
    toast.error('Validation Error', message);
  };

  return {
    showError,
    showApiError,
    showValidationError,
  };
} 