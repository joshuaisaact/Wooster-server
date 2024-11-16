import { Request, Response } from 'express';

import {
  addDestination,
  findDestinationByName,
  generateNewDestination,
} from '../../services/destination-service';
import {
  addSavedDestination,
  findSavedDestinationByUserAndDest,
} from '../../services/saved-destination-service';
import { logger } from '../../utils/logger';

interface CreateDestinationRequestBody {
  destination: string;
}

interface CreateDestinationRequestBody {
  destination: string;
}

export const handleAddDestination = async (
  req: Request<object, object, CreateDestinationRequestBody>,
  res: Response,
) => {
  try {
    const { destination } = req.body;
    const userId = req.user!.id;

    if (!destination?.trim()) {
      return res.status(400).json({
        error: 'Destination is required',
      });
    }
    try {
      const existingDestination = await findDestinationByName(destination);

      if (existingDestination) {
        // Check if user already saved this destination
        const existingSaved = await findSavedDestinationByUserAndDest(
          userId,
          existingDestination.destinationId,
        );

        if (existingSaved) {
          return res.status(409).json({
            error: 'Destination is already saved',
          });
        }

        // Save existing destination for user
        const savedDestination = await addSavedDestination(
          userId,
          existingDestination.destinationId,
        );

        return res.status(200).json({
          message: 'Existing destination saved successfully',
          destination: {
            ...existingDestination,
            saved: savedDestination,
          },
        });
      }

      // Create new destination if it doesn't exist
      const destinationData = await generateNewDestination(destination);
      const newDestination = await addDestination(destinationData);

      // Save it for the user
      const savedDestination = await addSavedDestination(
        userId,
        newDestination.destinationId,
      );

      return res.status(201).json({
        message: 'Destination created and saved successfully',
        destination: {
          ...newDestination,
          saved: savedDestination,
        },
      });
    } catch (error) {
      logger.error('Error processing destination request:', error);
      return res.status(500).json({
        error: 'An unexpected error occurred. Please try again later.',
      });
    }
  } catch (error) {
    console.error('Unhandled Error:', error);
    return res.status(500).json({
      error: 'An unexpected error occurred. Please try again later.',
    });
  }
};
