export class ServiceError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown,
  ) {
    super(message);
    this.name = 'ServiceError';
  }
}

export const isServiceError = (error: unknown): error is ServiceError => {
  return error instanceof ServiceError;
};

export const isDatabaseError = (error: unknown): boolean => {
  return typeof error === 'object' && error !== null && 'code' in error;
};

export interface AIError {
  operation: 'TRIP_GENERATION' | 'DESTINATION_GENERATION' | 'PARSING';
  message: string;
  details?: unknown;
}

export const isAIError = (error: unknown): error is AIError => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'operation' in error &&
    'message' in error
  );
};

export const handleControllerError = (error: unknown) => {
  console.error('Error caught:', error);

  if (isServiceError(error)) {
    return {
      status: error.status,
      message: error.message,
      data: error.data,
    };
  }

  if (isDatabaseError(error)) {
    return {
      status: 409,
      message: 'Resource already exists',
    };
  }

  if (isAIError(error)) {
    switch (error.operation) {
      case 'TRIP_GENERATION':
        return {
          status: 500,
          message: 'Failed to generate trip itinerary. Please try again.',
          data: error.details,
        };
      case 'DESTINATION_GENERATION':
        return {
          status: 500,
          message:
            'Failed to generate destination information. Please try again.',
          data: error.details,
        };
      case 'PARSING':
        return {
          status: 500,
          message: 'Failed to process AI response. Please try again.',
          data: error.details,
        };
    }
  }

  return {
    status: 500,
    message: 'Something went wrong',
  };
};
