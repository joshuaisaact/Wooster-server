import { Request, Response } from 'express';
import supabase from '../models/supabaseClient';

const deleteDestination = async (
  req: Request,
  res: Response,
): Promise<void> => {
  // console.log(req.params);
  const { destinationId } = req.params;

  try {
    const { data, error } = await supabase
      .from('destinations')
      .delete()
      .match({ destination_id: destinationId })
      .select(); // Add .select() to return the deleted row

    // console.log('Supabase Response:', { data, error });

    if (error) {
      throw error;
    }

    if (data && data.length === 0) {
      res.status(404).json({ error: 'Destination not found' });
      return;
    }

    console.log('Destination deleted successfully');
    res.status(200).json({ message: 'Destination deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

export default deleteDestination;
