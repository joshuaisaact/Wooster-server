import { ServiceError } from '@/types/errors';

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
