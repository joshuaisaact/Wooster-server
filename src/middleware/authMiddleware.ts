import { Request, Response, NextFunction } from 'express';
import supabase from '../models/supabaseClient';
import { User } from '@supabase/supabase-js';

interface AuthenticatedRequest extends Request {
  user?: User;
}

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      res.status(401).json({ error: 'Authorization token required' });
      return;
    }

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      res.status(401).json({ error: 'Invalid or expired token' });
      return;
    }

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (userError) {
      console.error('Error fetching user data:', userError);
      res.status(500).json({ error: 'Error fetching user data' });
      return;
    }

    req.user = userData;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ error: 'An unknown error occurred' });
  }
};
