import { fetchTripFromDB, updateTripInDB } from '../../services/trip-service';
import { Request, Response } from 'express';

export const handleUpdateTrip = async (
  req: Request<
    { tripId: string },
    object,
    {
      startDate?: string;
      title?: string;
      description?: string;
      status?: 'PLANNING' | 'BOOKED' | 'COMPLETED';
    }
  >,
  res: Response,
) => {
  const { tripId } = req.params;
  const { startDate, title, description, status } = req.body;
  const userId = req.user!.id;

  // Validate input
  if (!startDate && !title && !description) {
    return res.status(400).json({
      error:
        'At least one field (startDate, title, description, or status) must be provided for update.',
    });
  }

  if (status && !['PLANNING', 'BOOKED', 'COMPLETED'].includes(status)) {
    return res.status(400).json({
      error: 'Invalid status value',
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
    status,
  });

  return res.status(201).json({
    message: 'Trip updated successfully',
    trip: updatedTrip,
  });
};
