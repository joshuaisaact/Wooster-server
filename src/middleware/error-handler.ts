import { ErrorRequestHandler, Request, Response } from 'express';
import { logger } from '../utils/logger';

export const errorHandler: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
) => {
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

  res.status(500).json({
    error: err.message || 'Internal Server Error',
    details: process.env.NODE_ENV !== 'production' ? err.stack : undefined,
  });
};
