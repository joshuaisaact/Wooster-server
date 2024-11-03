import { Request, Response } from 'express';
import { fetchTripsFromDB } from '../../services/trip-service';
import reshapeTripData from '../../utils/reshape-trip-data-drizzle';

export const handleGetTrips = async (req: Request, res: Response) => {
  try {
    const trips = await fetchTripsFromDB(req.user!.id);
    const reshapedTrips = reshapeTripData(trips);
    res.json(reshapedTrips);
  } catch (error) {
    console.error('Error fetching trips:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};
