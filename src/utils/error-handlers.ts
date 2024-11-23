import { ErrorCode, ServiceError } from '../types/errors';

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
