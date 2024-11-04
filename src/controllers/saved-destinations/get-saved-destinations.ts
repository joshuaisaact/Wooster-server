import { Request, Response } from 'express';
import { fetchSavedDestinations } from '../../services/saved-destination-service/';

export const handleGetSavedDestinations = async (
  req: Request,
  res: Response,
) => {
  try {
    const savedDestinations = await fetchSavedDestinations(req.user!.id);
    res.json(savedDestinations);
  } catch (error) {
    console.error('Error fetching saved destinations:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};
