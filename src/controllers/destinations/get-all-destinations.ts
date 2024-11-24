import { Request, Response } from 'express';
import { fetchDestinations } from '../../services/destination-service';

export const handleGetDestinations = async (_req: Request, res: Response) => {
  const destinations = await fetchDestinations();
  res.json({
    message: 'Fetched destinations successfully',
    destinations,
  });
};
