import { Request, Response } from 'express';
import trip from '../models/trip';

const getTrip = (_req: Request, res: Response) => {
  try {
    res.json(trip);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

export default getTrip;
