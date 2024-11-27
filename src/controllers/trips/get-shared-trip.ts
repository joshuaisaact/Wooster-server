import { Request, Response } from 'express';
import {
  createDBNotFoundError,
  createValidationError,
} from '../../utils/error-handlers';
import { db, sharedTrips } from '../../db';
import { eq } from 'drizzle-orm';
import { fetchTripFromDB } from '../../services/trip-service';

export const handleGetSharedTrip = async (
  req: Request<{ shareCode: string }>,
  res: Response,
) => {
  const { shareCode } = req.params;

  if (!shareCode) {
    throw createValidationError('Share code is required');
  }

  // First get the shared trip record
  const sharedTrip = await db.query.sharedTrips.findFirst({
    where: eq(sharedTrips.shareCode, shareCode),
    columns: {
      tripId: true,
      expiresAt: true,
    },
  });

  if (!sharedTrip) {
    throw createDBNotFoundError('Shared trip not found');
  }

  if (sharedTrip.expiresAt && new Date(sharedTrip.expiresAt) < new Date()) {
    throw createValidationError('Share link has expired');
  }

  // Use the existing fetch function without userId
  const trip = await fetchTripFromDB(sharedTrip.tripId.toString());

  return res.status(200).json({
    message: 'Shared trip fetched successfully',
    trip: trip[0],
  });
};
