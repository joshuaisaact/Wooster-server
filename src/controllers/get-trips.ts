import { Request, Response } from 'express';
import { getTripsFromDb } from '../services/trip-service';
import transformData from '../utils/reshape-trip-data';

const getTrips = async (_req: Request, res: Response) => {
  try {
    const trips = await getTripsFromDb();
    const reshapedTrips = transformData(trips);
    res.json(reshapedTrips);
  } catch (error) {
    console.error('Error fetching trips:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

export default getTrips;
