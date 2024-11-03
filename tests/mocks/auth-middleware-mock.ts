import { User } from '@supabase/supabase-js';
import { NextFunction, Request, Response } from 'express';

export const mockAuthMiddleware = {
  requireAuth: (
    req: Request & { user?: User },
    res: Response,
    next: NextFunction,
  ): void => {
    if (!req.headers.authorization) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    req.user = {
      id: 'test-user-id',
      app_metadata: {},
      aud: 'authenticated',
      created_at: '',
      role: '',
      user_metadata: {},
    } as User;
    return next();
  },
};
