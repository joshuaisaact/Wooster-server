import { Request, Response, NextFunction } from 'express';
import { User } from '@supabase/supabase-js';
import 'dotenv/config';

export const requireAuth = jest.fn(
  (req: Request, res: Response, next: NextFunction): Response | void => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: 'No authorization header' });
    }

    req.user = {
      id: process.env.TEST_USER_UUID,
      app_metadata: {},
      aud: 'authenticated',
      created_at: '',
      role: '',
      user_metadata: {},
    } as User;

    next();
  },
);
