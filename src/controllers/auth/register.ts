import { Request, Response } from 'express';
import supabase from '../../models/supabaseClient';

const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    if (data.user && data.session) {
      res.status(201).json({ user: data.user, session: data.session });
    } else {
      res.status(200).json({
        message:
          'Signup successful. Please check your email to confirm your account.',
      });
    }
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
};

export default register;
