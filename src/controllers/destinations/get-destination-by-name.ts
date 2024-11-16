import { Request, Response } from 'express';
import { fetchDestinationDetailsByName } from '../../services/destination-service';
import { logger } from '../../utils/logger';

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
    logger.error('Error fetching destination details:', { error });

    // Return a general error response
    return res.status(500).json({ error: 'Something went wrong' });
  }
};
