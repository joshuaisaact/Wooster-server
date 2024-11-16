import { Request, Response } from 'express';
import { fetchActivitiesByDestinationName } from '../../services/destination-service';
import { logger } from '../../utils/logger';

export const handleGetDestinationActivities = async (
  req: Request,
  res: Response,
) => {
  const { destinationName } = req.params;

  if (!destinationName || destinationName.trim() === '') {
    logger.warn({ destinationName }, 'Invalid destination name provided');
    return res.status(400).json({ error: 'Destination name is required' });
  }

  const decodedDestinationName = decodeURIComponent(destinationName);

  try {
    logger.info(
      { destinationName: decodedDestinationName },
      'Fetching activities for destination',
    );
    const activities = await fetchActivitiesByDestinationName(
      decodedDestinationName,
    );

    logger.info(
      { destinationName: decodedDestinationName, count: activities.length },
      'Successfully fetched activities',
    );
    return res.json(activities);
  } catch (error) {
    logger.error(
      { error, destinationName: decodedDestinationName },
      'Error while fetching activities',
    );
    return res.status(500).json({ error: 'Something went wrong' });
  }
};
