import { Request, Response } from 'express';
import { createShareLink, fetchTripFromDB } from '../../services/trip-service';
import {
  createDBNotFoundError,
  createValidationError,
} from '../../utils/error-handlers';

export const handleCreateShareLink = async (
  req: Request<{ tripId: string }>,
  res: Response,
) => {
  const { tripId } = req.params;
  const userId = req.user!.id;

  // Validate and parse tripId
  const parsedTripId = parseInt(tripId, 10);
  if (isNaN(parsedTripId)) {
    throw createValidationError('Invalid trip ID');
  }

  const trip = await fetchTripFromDB(tripId, userId); // uses string

  if (!trip) {
    throw createDBNotFoundError('Trip not found');
  }

  const sharedTrip = await createShareLink(parsedTripId, userId); // uses number

  return res.status(201).json({
    message: 'Share link created successfully',
    shareCode: sharedTrip.shareCode,
  });
};
