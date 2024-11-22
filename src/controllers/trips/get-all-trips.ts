import { Request, Response } from 'express';
import { fetchTripsFromDB } from '../../services/trip-service';

export const handleGetTrips = async (req: Request, res: Response) => {
  const trips = await fetchTripsFromDB(req.user!.id);
  res.status(200).json({ trips });
};
