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

  return {
    status: 500,
    message: 'Something went wrong',
  };
};
