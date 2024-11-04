import { Request, Response } from 'express';
import { handleControllerError } from '../../utils/error-handlers';
import { fetchTripFromDB } from '../../services/trip-service';

export const handleGetTrip = async (req: Request, res: Response) => {
  try {
    const tripId = req.params.id;
    const userId = req.user!.id;

    if (!tripId) {
      return res.status(400).json({ error: 'Trip ID is required' });
    }

    try {
      // Assuming you have this function in your trip service
      const trip = await fetchTripFromDB(tripId, userId);

      if (!trip) {
        return res.status(404).json({ error: 'Trip not found' });
      }

      return res.status(200).json({
        message: 'Trip fetched successfully',
        trip,
      });
    } catch (error) {
      const { status, message } = handleControllerError(error);
      return res.status(status).json({ error: message });
    }
  } catch (error) {
    console.error('Error fetching trip:', error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};
