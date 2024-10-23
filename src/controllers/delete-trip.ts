import { Request, Response } from 'express';
import { deleteTripById } from '../services/trip-service';
import { deleteItineraryDaysByTripId } from '../services/itinerary-service';

const deleteTrip = async (req: Request, res: Response): Promise<Response> => {
  const tripId = Number(req.params.tripId);

  if (isNaN(tripId)) {
    return res.status(400).json({ error: 'Invalid trip ID' });
  }

  try {
    await deleteItineraryDaysByTripId(tripId);

    const rowsDeleted = await deleteTripById(tripId);

    if (rowsDeleted === 0) {
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
