import { Request, Response } from 'express';
import supabase from '../models/supabaseClient';

const getDestinationDetails = async (req: Request, res: Response) => {
  const { destinationId } = req.params;
  const decodedDestinationName = decodeURIComponent(destinationId);

  try {
    const { data: destination, error } = await supabase
      .from('destinations')
      .select('*')
      .eq('destination_name', decodedDestinationName)
      .single();

    if (error) {
      console.error('Error fetching destination:', error);
      return res.status(500).json({ error: 'Error fetching destination' });
    }

    if (!destination) {
      return res.status(404).json({ error: 'Destination not found' });
    }

    return res.json(destination);
  } catch (error) {
    console.error('Error fetching destination details:', error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

export default getDestinationDetails;
