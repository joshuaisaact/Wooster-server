import { Request, Response } from 'express';
import { fetchSavedDestinations } from '../../services/saved-destination-service/';
import { logger } from '../../utils/logger';

export const handleGetSavedDestinations = async (
  req: Request,
  res: Response,
) => {
  try {
    const savedDestinations = await fetchSavedDestinations(req.user!.id);
    return res.status(200).json({
      message: 'Fetched saved destinations successfully',
      savedDestinations,
    });
  } catch (error) {
    logger.error('Error fetching saved destinations:', error);

    return res.status(500).json({
      error: 'Failed to fetch saved destinations. Please try again later.',
    });
  }
};
