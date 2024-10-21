import { Request, Response } from 'express';
import {
  deleteItineraryDaysByTripId,
  deleteTripById,
} from '../services/trip-service';

const deleteTrip = async (req: Request, res: Response): Promise<Response> => {
  const { tripId } = req.params;

  try {
    await deleteItineraryDaysByTripId(tripId);
    const deletedTrip = await deleteTripById(tripId);

    if (deletedTrip && deletedTrip.length === 0) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    console.log('Trip and related itinerary deleted successfully');
    return res.status(200).json({ message: 'Trip deleted successfully' });
  } catch (error) {
    console.error('Error deleting trip:', error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

export default deleteTrip;
