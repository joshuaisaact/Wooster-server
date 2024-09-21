import { Request, Response } from 'express';
import supabase from '../models/supabaseClient';

const getDestinations = async (_req: Request, res: Response) => {
  try {
    const { data: destinations, error } = await supabase
      .from('destinations')
      .select('*');

    if (error) {
      throw error;
    }

    res.json(destinations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

export default getDestinations;
