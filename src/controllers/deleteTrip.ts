import { Request, Response } from 'express';
import supabase from '../models/supabaseClient';

const deleteTrip = async (req: Request, res: Response): Promise<void> => {
  // Extract the tripId from the request parameters
  const { tripId } = req.params;

  try {
    // First, delete the related rows in the itinerary_days table
    const { error: itineraryError } = await supabase
      .from('itinerary_days')
      .delete()
      .match({ trip_id: tripId });

    // Check for errors in the itinerary_days deletion
    if (itineraryError) {
      throw itineraryError;
    }

    // Now delete the trip from the trips table
    const { data, error: tripError } = await supabase
      .from('trips')
      .delete()
      .match({ trip_id: tripId })
      .select(); // Add .select() to return the deleted row

    // Check for errors in the trips deletion
    if (tripError) {
      throw tripError;
    }

    // If no data was deleted from the trips table, return a 404 error
    if (data && data.length === 0) {
      res.status(404).json({ error: 'Trip not found' });
      return;
    }

    // If successful, return a success message
    console.log('Trip and related itinerary deleted successfully');
    res.status(200).json({ message: 'Trip deleted successfully' });
  } catch (error) {
    // Log any errors and return a 500 error response
    console.error('Error deleting trip:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

export default deleteTrip;
