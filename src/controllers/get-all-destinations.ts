import { Request, Response } from 'express';
import { fetchDestinationsFromDB } from '../services/destination-service';

const handleGetDestinations = async (_req: Request, res: Response) => {
  try {
    const destinations = await fetchDestinationsFromDB();
    res.json(destinations);
  } catch (error) {
    console.error('Error fetching destinations:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

export default handleGetDestinations;
