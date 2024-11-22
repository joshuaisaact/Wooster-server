import { Request, Response } from 'express';
import {
  addSavedDestination,
  findSavedDestinationByUserAndDest,
} from '../../services/saved-destination-service';
import { logger } from '../../utils/logger';

export const handleAddSavedDestination = async (
  req: Request,
  res: Response,
) => {
  try {
    const userId = req.user!.id;
    const destinationId = Number(req.params.destinationId);
    const { notes = undefined, isVisited = false } = req.body;

    if (isNaN(destinationId)) {
      return res
        .status(400)
        .json({ error: 'Valid destination ID is required' });
    }

    const existingSaved = await findSavedDestinationByUserAndDest(
      userId,
      destinationId,
    );
    if (existingSaved) {
      return res.status(409).json({
        error: 'Destination already saved!',
        savedDestination: existingSaved,
      });
    }

    const savedDestination = await addSavedDestination(
      userId,
      destinationId,
      notes,
      isVisited,
    );

    return res.status(201).json({
      message: 'Destination saved successfully',
      savedDestination,
    });
  } catch (error) {
    logger.error('Error saving destination:', error);
    return res.status(500).json({
      error: 'Failed to save destination',
    });
  }
};
