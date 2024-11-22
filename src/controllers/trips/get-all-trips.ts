import { Request, Response } from 'express';
import { fetchTripsFromDB } from '../../services/trip-service';
import reshapeTripData from '../../utils/reshape-trip-data-drizzle';

export const handleGetTrips = async (req: Request, res: Response) => {
  const trips = await fetchTripsFromDB(req.user!.id);

  const reshapedTrips = reshapeTripData(trips);

  res.status(200).json(reshapedTrips);
};
