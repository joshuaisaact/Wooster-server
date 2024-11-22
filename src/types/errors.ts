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
