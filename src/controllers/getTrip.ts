import { Request, Response } from 'express';
import trips from '../models/trip';

const getTrip = (_req: Request, res: Response) => {
  try {
    res.json(trips);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

export default getTrip;
