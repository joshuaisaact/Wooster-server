export type ErrorCode =
  | 'AUTHENTICATION_ERROR'
  | 'DATABASE_CONNECTION_ERROR'
  | 'DESTINATION_EXISTS'
  | 'DESTINATION_GENERATION_FAILED'
  | 'DESTINATION_ALREADY_SAVED'
  | 'VALIDATION_ERROR'
  | 'AI_MODEL_OVERLOADED'
  | 'AI_SERVICE_ERROR'
  | 'DB_CONNECTION_ERROR'
  | 'DB_QUERY_FAILED'
  | 'DB_NOT_FOUND'
  | 'TRIP_GENERATION_FAILED'
  | 'INVALID_ITINERARY_DATA'
  | 'PARSING_ERROR';

export interface ServiceError {
  message: string;
  status: number;
  code: ErrorCode;
  details?: unknown;
}

export const createServiceError = (
  message: string,
  status: number,
  code: ErrorCode,
  details?: unknown,
): ServiceError => ({
  message,
  status,
  code,
  details,
});

export const createAuthenticationError = (
  message: string = 'Authentication failed',
  details?: unknown,
): ServiceError =>
  createServiceError(message, 401, 'AUTHENTICATION_ERROR', details);

export const createDatabaseConnectionError = (
  message: string = 'Database connection failed',
  details?: unknown,
): ServiceError =>
  createServiceError(message, 403, 'DATABASE_CONNECTION_ERROR', details);

export const createDestinationGenerationError = (
  message: string = 'Failed to generate destination data',
  details?: unknown,
): ServiceError =>
  createServiceError(message, 500, 'DESTINATION_GENERATION_FAILED', details);

export const createTripGenerationError = (
  message: string = 'Failed to generate trip itinerary',
  details?: unknown,
): ServiceError =>
  createServiceError(message, 500, 'TRIP_GENERATION_FAILED', details);

export const createParsingError = (
  message: string = 'Failed to parse data',
  details?: unknown,
): ServiceError => createServiceError(message, 422, 'PARSING_ERROR', details);

export const createAIServiceError = (
  message: string = 'AI service error',
  details?: unknown,
): ServiceError =>
  createServiceError(message, 500, 'AI_SERVICE_ERROR', details);

export const createValidationError = (
  message: string = 'Validation failed',
  details?: unknown,
): ServiceError =>
  createServiceError(message, 422, 'VALIDATION_ERROR', details);

export const isServiceError = (error: unknown): error is ServiceError => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'status' in error &&
    'message' in error
  );
};

export const isAIServiceError = (error: unknown): error is ServiceError => {
  return isServiceError(error) && error.code === 'AI_SERVICE_ERROR';
};

export const createDatabaseError = (
  message: string,
  status: number,
  code: ErrorCode,
  details?: unknown,
): ServiceError => ({
  message,
  status,
  code,
  details,
});

export const createDBQueryError = (
  message: string = 'Database query failed',
  details?: unknown,
): ServiceError =>
  createDatabaseError(message, 500, 'DB_QUERY_FAILED', details);

export const createDBNotFoundError = (
  message: string = 'Database record not found',
  details?: unknown,
): ServiceError => createDatabaseError(message, 404, 'DB_NOT_FOUND', details);
