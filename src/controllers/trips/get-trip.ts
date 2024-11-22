import { Request, Response } from 'express';
import { fetchTripsFromDB } from '../../services/trip-service';
import { createValidationError } from '../../utils/error-handlers';

export const handleGetTrip = async (req: Request, res: Response) => {
  const tripId = req.params.id;

  if (!tripId) {
    throw createValidationError('Trip ID is required');
  }

  const trip = await fetchTripsFromDB(req.user!.id, tripId);
  return res.status(200).json({
    message: 'Trip fetched successfully',
    trip,
  });
};
