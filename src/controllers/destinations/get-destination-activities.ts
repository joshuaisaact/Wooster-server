import { Request, Response } from 'express';
import { fetchActivitiesByDestinationName } from '../../services/destination-service';

export const handleGetDestinationActivities = async (
  req: Request,
  res: Response,
) => {
  const { destinationName } = req.params;

  if (!destinationName || destinationName.trim() === '') {
    return res.status(400).json({ error: 'Destination name is required' });
  }

  const decodedDestinationName = decodeURIComponent(destinationName);

  try {
    const activities = await fetchActivitiesByDestinationName(
      decodedDestinationName,
    );
    return res.json(activities);
  } catch (error) {
    console.error('Error fetching destination activities:', error);

    if (error instanceof Error) {
      if (error.message.includes('not found')) {
        return res.status(404).json({ error: 'Destination not found' });
      }
    }

    return res.status(500).json({ error: 'Something went wrong' });
  }
};
