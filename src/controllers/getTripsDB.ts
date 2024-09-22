import { Request, Response } from 'express';
import supabase from '../models/supabaseClient';
// import reshapeTripData from '../utils/reshapeTripData';
// import transformData from '../utils/reshapeTripData';

const getTripsDB = async (_req: Request, res: Response) => {
  try {
    // Fetch trips data, including associated itinerary days, activities, and destination details
    const { data: trips, error } = await supabase
      .from('trips')
      .select(
        `
      trip_id,
      destination_id,
      start_date,
      num_days,
      itinerary_days!inner (
        day_number,
        activities (
          activity_id,
          activity_name,
          latitude,
          longitude,
          price,
          location,
          description
        )
      ),
      destinations!inner (
        destination_id,
        destination_name,
        latitude,
        longitude,
        description,
        country
      )
    `,
      )
      .eq('user_id', 1); // Adjust the user_id filtering as needed

    // Handle any errors that might arise during the query
    if (error) {
      throw error;
    }

    // Log the trips data for debugging purposes
    console.log(trips);

    // const reshapedTrips = transformData(trips);
    // console.log(reshapedTrips);

    // Send the trips data as a JSON response
    res.json(trips);
  } catch (error) {
    // Log any error that occurs for debugging purposes
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

export default getTripsDB;
