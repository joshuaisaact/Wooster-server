import { Request, Response } from 'express';
import { fetchActivitiesByDestinationName } from '../../services/destination-service';
import { logger } from '../../utils/logger';
import { createValidationError } from '../../utils/error-handlers';

export const handleGetDestinationActivities = async (
  req: Request,
  res: Response,
) => {
  const { destinationName } = req.params;

  if (!destinationName?.trim()) {
    throw createValidationError('Destination name is required');
  }

  const decodedDestinationName = decodeURIComponent(destinationName);
  logger.info(
    { destinationName: decodedDestinationName },
    'Fetching activities',
  );

  const activities = await fetchActivitiesByDestinationName(
    decodedDestinationName,
  );
  logger.info({ count: activities.length }, 'Activities fetched');

  return res.json({
    activities: activities,
    message: 'Activities fetched successfully',
  });
};
