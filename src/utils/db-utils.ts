import {
  createDBNotFoundError,
  createDBQueryError,
  isServiceError,
} from '@/types/errors';
import { logger } from './logger';

interface DbOperationOptions {
  context?: Record<string, unknown>;
  notFoundMessage?: string;
}

export const executeDbOperation = async <T>(
  operation: () => Promise<T>,
  errorMessage: string,
  options: DbOperationOptions = {},
): Promise<T> => {
  try {
    const result = await operation();

    if (result === null && options.notFoundMessage) {
      throw createDBNotFoundError(options.notFoundMessage, options.context);
    }

    return result;
  } catch (error) {
    if (isServiceError(error)) {
      throw error;
    }

    logger.error({ error, ...options.context }, errorMessage);

    throw createDBQueryError(errorMessage, {
      originalError: error instanceof Error ? error.message : 'Unknown error',
      ...options.context,
    });
  }
};
