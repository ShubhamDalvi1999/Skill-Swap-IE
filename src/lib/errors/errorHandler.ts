import { AppError } from './AppError';

interface ErrorMetadata {
  context: string;
  additionalData?: Record<string, any>;
}

/**
 * Handles errors in a consistent way across the application
 * Logs errors and provides standardized error objects
 */
export class ErrorHandler {
  /**
   * Log an error with context
   */
  static logError(error: unknown, metadata: ErrorMetadata): void {
    const appError = AppError.from(error);
    
    // In development, log more details
    if (process.env.NODE_ENV === 'development') {
      console.error(`[${metadata.context}] ${appError.message}`, {
        errorCode: appError.code,
        errorContext: appError.context,
        ...metadata.additionalData,
        originalError: appError.originalError,
        stack: appError instanceof Error ? appError.stack : undefined
      });
    } else {
      // In production, log minimal information
      console.error(`[${metadata.context}] ${appError.message}`, {
        errorCode: appError.code,
        ...metadata.additionalData
      });
    }
  }

  /**
   * Handle API errors consistently
   * Returns a standardized error for API responses
   */
  static handleApiError(error: unknown, context: string): {
    message: string;
    code: string;
  } {
    const appError = AppError.from(error);
    
    // Log the error
    this.logError(appError, { context });
    
    // Return standardized error object for API responses
    return {
      message: appError.message,
      code: appError.code,
    };
  }

  /**
   * Handle form validation errors
   */
  static handleValidationError(error: unknown, formName: string): {
    message: string;
    code: string;
    fieldErrors?: Record<string, string>;
  } {
    const appError = AppError.from(error);
    
    // Log the error
    this.logError(appError, { 
      context: `Form Validation: ${formName}`,
      additionalData: { formName }
    });
    
    // Extract field errors if available in the context
    const fieldErrors = appError.context?.fieldErrors as Record<string, string> | undefined;
    
    // Return standardized validation error
    return {
      message: appError.message,
      code: 'VALIDATION_ERROR',
      fieldErrors
    };
  }

  /**
   * Transform any error to a user-friendly message
   * Use this for displaying errors in the UI
   */
  static getUserFriendlyMessage(error: unknown): string {
    const appError = AppError.from(error);
    
    // Map error codes to user-friendly messages
    switch (appError.code) {
      case 'AUTH_ERROR':
        return 'Authentication failed. Please check your credentials and try again.';
      case 'VALIDATION_ERROR':
        return 'Please check the form for errors and try again.';
      case 'NOT_FOUND':
        return 'The requested resource could not be found.';
      case 'SERVER_ERROR':
        return 'An unexpected error occurred. Please try again later.';
      default:
        return 'Something went wrong. Please try again later.';
    }
  }
} 