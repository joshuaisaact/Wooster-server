import { Request, Response } from 'express';
import { logger } from '../../utils/logger';
import { fetchTripFromDB } from '../../services/trip-service';

export const handleGetTrip = async (req: Request, res: Response) => {
  try {
    const tripId = req.params.id;
    const userId = req.user!.id;

    // Validate input
    if (!tripId) {
      return res.status(400).json({ error: 'Trip ID is required' });
    }

    // Fetch the trip from the database
    const trip = await fetchTripFromDB(tripId, userId);

    // Check if the trip exists
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    // Return the trip data to the client
    return res.status(200).json({
      message: 'Trip fetched successfully',
      trip,
    });
  } catch (error) {
    logger.error('Error fetching trip:', error);

    return res.status(500).json({
      error: 'Something went wrong while fetching the trip',
    });
  }
};
