import { Request, Response } from 'express';
import supabase from '../models/supabaseClient';

const deleteTrip = async (req: Request, res: Response): Promise<void> => {
  // Extract the tripId from the request parameters
  const { tripId } = req.params;

  try {
    const { error: itineraryError } = await supabase
      .from('itinerary_days')
      .delete()
      .match({ trip_id: tripId });

    if (itineraryError) {
      throw itineraryError;
    }

    const { data, error: tripError } = await supabase
      .from('trips')
      .delete()
      .match({ trip_id: tripId })
      .select();

    if (tripError) {
      throw tripError;
    }

    if (data && data.length === 0) {
      res.status(404).json({ error: 'Trip not found' });
      return;
    }

    console.log('Trip and related itinerary deleted successfully');
    res.status(200).json({ message: 'Trip deleted successfully' });
  } catch (error) {
    console.error('Error deleting trip:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

export default deleteTrip;
