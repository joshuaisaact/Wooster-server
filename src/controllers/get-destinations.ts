import { Request, Response } from 'express';
import { getDestinationsFromDb } from '../services/destination-service';

const getDestinations = async (_req: Request, res: Response) => {
  try {
    const destinations = await getDestinationsFromDb();
    res.json(destinations);
  } catch (error) {
    console.error('Error fetching destinations:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

export default getDestinations;
