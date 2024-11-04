import { Request, Response } from 'express';
import { fetchDestinationDetailsByName } from '../../services/destination-service';

export const handleGetDestinationByName = async (
  req: Request,
  res: Response,
) => {
  const { destinationName } = req.params;

  if (!destinationName || destinationName.trim() === '') {
    return res.status(400).json({ error: 'Destination name is required' });
  }

  const decodedDestinationName = decodeURIComponent(destinationName);

  try {
    const destination = await fetchDestinationDetailsByName(
      decodedDestinationName,
    );

    if (!destination) {
      return res.status(404).json({ error: 'Destination not found' });
    }

    return res.json({
      ...destination,
      destinationId: Number(destination.destinationId),
      averageTemperatureLow: String(destination.averageTemperatureLow),
      averageTemperatureHigh: String(destination.averageTemperatureHigh),
      safetyRating: String(destination.safetyRating),
    });
  } catch (error) {
    console.error('Error fetching destination details:', error);

    if (error instanceof Error) {
      if (error.message.includes('not found')) {
        return res.status(404).json({ error: 'Destination not found' });
      }
    }

    return res.status(500).json({ error: 'Something went wrong' });
  }
};
