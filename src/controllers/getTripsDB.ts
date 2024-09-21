import { Request, Response } from 'express';
import supabase from '../models/supabaseClient';

const getTripsDB = async (_req: Request, res: Response) => {
  try {
    const { data: trips, error } = await supabase
      .from('trips')
      .select(
        `
      trip_id,
      destinations (
        destination_name
      ),
      num_days,
      start_date,
      itinerary_days (
        day_number,
        activities (
          activity_name,
          description,
          location,
          price,
          image
        )
      )
    `,
      )
      .eq('user_id', 1); // Adjust as needed

    if (error) {
      throw error;
    }

    res.json(trips); // Send the trips data as a response
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

export default getTripsDB;
