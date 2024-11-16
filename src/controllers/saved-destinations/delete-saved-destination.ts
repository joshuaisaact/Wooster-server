import { Request, Response } from 'express';
import { deleteSavedDestination } from '../../services/saved-destination-service/';
import { logger } from '../../utils/logger';

export const handleDeleteSavedDestination = async (
  req: Request,
  res: Response,
) => {
  const { destinationId } = req.params;
  const userId = req.user!.id;

  try {
    if (!destinationId || isNaN(Number(destinationId))) {
      return res
        .status(400)
        .json({ error: 'Valid destination ID is required' });
    }

    const result = await deleteSavedDestination(userId, Number(destinationId));

    if (result) {
      return res.status(200).json({
        message: 'Saved destination deleted successfully',
      });
    }

    return res.status(404).json({
      error: 'Saved destination not found',
    });
  } catch (error) {
    logger.error('Error deleting saved destination:', error);

    return res.status(500).json({
      error: 'Failed to delete saved destination',
    });
  }
};
