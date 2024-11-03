import { Request, Response } from 'express';
import {
  addSavedDestination,
  findSavedDestinationByUserAndDest,
} from '../services/destination-service';

export const handleAddSavedDestination = async (
  req: Request,
  res: Response,
) => {
  try {
    const userId = req.user!.id;
    const { destinationId, notes = undefined, isVisited = false } = req.body;

    if (!destinationId || isNaN(Number(destinationId))) {
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
        savedDesination: existingSaved,
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
    console.error('Error saving destination:', error);
    return res.status(500).json({ error: 'Failed to save destination' });
  }
};
