import { Request, Response } from 'express';
import { fetchTripFromDB } from '../../services/trip-service';
import { createValidationError } from '../../utils/error-handlers';

export const handleGetTrip = async (req: Request, res: Response) => {
  const tripId = req.params.id;

  if (!tripId) {
    throw createValidationError('Trip ID is required');
  }

  const trips = await fetchTripFromDB(tripId, req.user!.id);

  // Return just the first trip since we're fetching by ID
  return res.status(200).json({
    message: 'Trip fetched successfully',
    trip: trips[0], // <-- Return single object instead of array
  });
};
