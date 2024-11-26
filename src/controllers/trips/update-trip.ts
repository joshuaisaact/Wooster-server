import { fetchTripFromDB, updateTripInDB } from '../../services/trip-service';
import { Request, Response } from 'express';

export const handleUpdateTrip = async (
  req: Request<
    { tripId: string },
    object,
    { startDate?: string; title?: string; description?: string }
  >,
  res: Response,
) => {
  const { tripId } = req.params;
  const { startDate, title, description } = req.body;
  const userId = req.user!.id;

  // Validate input
  if (!startDate && !title && !description) {
    return res.status(400).json({
      error:
        'At least one field (startDate, title, or description) must be provided for update.',
    });
  }

  // Check if the trip exists and belongs to the authenticated user
  const trip = await fetchTripFromDB(tripId, userId);
  if (!trip) {
    return res.status(404).json({ error: 'Trip not found' });
  }

  // Update the trip with the provided fields
  const updatedTrip = await updateTripInDB(tripId, {
    startDate,
    title,
    description,
  });

  return res.status(201).json({
    message: 'Trip updated successfully',
    trip: updatedTrip,
  });
};
