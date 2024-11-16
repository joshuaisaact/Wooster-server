import { Request, Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';
import { createAuthenticationError } from '../types/errors';
import { logger } from '../utils/logger';

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void | Response> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      const errorMessage = 'No authorization header';
      logger.warn({ req }, errorMessage);
      return res.status(401).json({ error: errorMessage });
    }

    const token = authHeader.replace('Bearer ', '');
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!,
    );

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      const errorMessage = 'Unauthorized';
      logger.warn({ error, user }, errorMessage);
      return res.status(401).json({ error: errorMessage });
    }

    req.user = user;
    logger.info({ user: user.id }, 'User authenticated');
    next();
  } catch (error) {
    const errorMessage = 'Authentication failed';
    logger.error({ error }, errorMessage);
    throw createAuthenticationError(errorMessage, {
      originalError: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
