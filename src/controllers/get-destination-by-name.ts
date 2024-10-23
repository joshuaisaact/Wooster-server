import { Request, Response } from 'express';
import { fetchDestinationDetailsByName } from '../services/destination-service';

const handleGetDestinationByName = async (req: Request, res: Response) => {
  const { destinationName } = req.params;
  const decodedDestinationName = decodeURIComponent(destinationName);

  try {
    const destination = await fetchDestinationDetailsByName(
      decodedDestinationName,
    );

    if (!destination) {
      return res.status(404).json({ error: 'Destination not found' });
    }

    return res.json(destination);
  } catch (error) {
    console.error('Error fetching destination details:', error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

export default handleGetDestinationByName;
