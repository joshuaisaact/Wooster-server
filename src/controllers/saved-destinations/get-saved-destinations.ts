import { Request, Response } from 'express';
import { fetchSavedDestinations } from '../../services/saved-destination-service/';

export const handleGetSavedDestinations = async (
  req: Request,
  res: Response,
) => {
  const savedDestinations = await fetchSavedDestinations(req.user!.id);
  return res.status(200).json({
    message: 'Fetched saved destinations successfully',
    savedDestinations,
  });
};
