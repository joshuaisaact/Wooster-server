import { Request, Response } from 'express';
import { fetchDestinations } from '../../services/destination-service';
import { logger } from '../../utils/logger';

export const handleGetDestinations = async (_req: Request, res: Response) => {
  try {
    const destinations = await fetchDestinations();
    res.json(destinations);
  } catch (error) {
    logger.error('Error fetching destinations:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};
