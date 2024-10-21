import { Request, Response } from 'express';
import supabase from '../../models/supabase-client';

const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    res.json({ user: data.user, session: data.session });
  } catch (error) {
    console.error('Sign in error:', error);
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
};

export default login;
