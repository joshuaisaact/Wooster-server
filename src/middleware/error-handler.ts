import { ErrorRequestHandler, Request, Response, NextFunction } from 'express';
import { isServiceError } from '../utils/error-guards';
import { logger } from '../utils/logger';

export const errorHandler: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Log all errors with request context
  logger.error({
    error: {
      message: err.message,
      stack: err.stack,
      name: err.name,
    },
    request: {
      method: req.method,
      url: req.url,
      headers: req.headers,
    },
  });

  // Handle known ServiceErrors
  if (isServiceError(err)) {
    return res.status(err.status).json({
      error: err.message,
      code: err.code,
      details: process.env.NODE_ENV !== 'production' ? err.details : undefined,
    });
  }

  // Handle unknown errors
  res.status(500).json({
    error:
      process.env.NODE_ENV === 'production'
        ? 'Internal Server Error'
        : err.message,
    code: 'DB_QUERY_FAILED',
    details: process.env.NODE_ENV !== 'production' ? err.stack : undefined,
  });

  return next(err);
};
