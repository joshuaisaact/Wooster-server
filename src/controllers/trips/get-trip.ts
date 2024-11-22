import { Request, Response } from 'express';
import { fetchTripFromDB } from '../../services/trip-service';
import {
  createDBNotFoundError,
  createValidationError,
} from '../../utils/error-handlers';

export const handleGetTrip = async (req: Request, res: Response) => {
  const tripId = req.params.id;
  const userId = req.user!.id;

  if (!tripId) {
    throw createValidationError('Trip ID is required');
  }

  const trip = await fetchTripFromDB(tripId, userId);

  if (!trip) {
    throw createDBNotFoundError('Trip not found');
  }

  return res.status(200).json({
    message: 'Trip fetched successfully',
    trip,
  });
};
