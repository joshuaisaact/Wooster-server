import { Request, Response } from 'express';
import { getDestinationDetailsByName } from '../services/destination-service';

const getDestinationDetails = async (req: Request, res: Response) => {
  const { destinationId } = req.params;
  const decodedDestinationName = decodeURIComponent(destinationId);

  try {
    const destination = await getDestinationDetailsByName(
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

export default getDestinationDetails;
