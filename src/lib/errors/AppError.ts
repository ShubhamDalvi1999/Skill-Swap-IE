/**
 * Custom error class for application errors
 * Extends the native Error class with additional context
 */
export class AppError extends Error {
  public readonly code: string;
  public readonly context?: Record<string, any>;
  public readonly originalError?: unknown;

  constructor(
    message: string,
    options?: {
      code?: string;
      cause?: unknown;
      context?: Record<string, any>;
    }
  ) {
    super(message, { cause: options?.cause });
    this.name = 'AppError';
    this.code = options?.code || 'UNKNOWN_ERROR';
    this.context = options?.context;
    this.originalError = options?.cause;

    // Ensures proper stack trace in Node.js
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }

  /**
   * Factory method to create an authentication error
   */
  static auth(message = 'Authentication failed', options?: Omit<ConstructorParameters<typeof AppError>[1], 'code'>) {
    return new AppError(message, { ...options, code: 'AUTH_ERROR' });
  }

  /**
   * Factory method to create a validation error
   */
  static validation(message = 'Validation failed', options?: Omit<ConstructorParameters<typeof AppError>[1], 'code'>) {
    return new AppError(message, { ...options, code: 'VALIDATION_ERROR' });
  }

  /**
   * Factory method to create a not found error
   */
  static notFound(message = 'Resource not found', options?: Omit<ConstructorParameters<typeof AppError>[1], 'code'>) {
    return new AppError(message, { ...options, code: 'NOT_FOUND' });
  }

  /**
   * Factory method to create a server error
   */
  static server(message = 'Internal server error', options?: Omit<ConstructorParameters<typeof AppError>[1], 'code'>) {
    return new AppError(message, { ...options, code: 'SERVER_ERROR' });
  }

  /**
   * Converts any error to an AppError for consistent handling
   */
  static from(error: unknown, defaultMessage = 'An unexpected error occurred'): AppError {
    if (error instanceof AppError) return error;
    
    const message = error instanceof Error ? error.message : defaultMessage;
    return new AppError(message, { 
      cause: error,
      code: 'UNKNOWN_ERROR'
    });
  }
} 