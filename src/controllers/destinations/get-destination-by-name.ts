import { Request, Response } from 'express';
import { fetchDestinationDetailsByName } from '../../services/destination-service';
import {
  createDBNotFoundError,
  createValidationError,
} from '../../utils/error-handlers';

export const handleGetDestinationByName = async (
  req: Request,
  res: Response,
) => {
  const { destinationName } = req.params;

  if (!destinationName?.trim()) {
    throw createValidationError('Destination name is required');
  }

  const decodedDestinationName = decodeURIComponent(destinationName);
  const destination = await fetchDestinationDetailsByName(
    decodedDestinationName,
  );

  if (!destination) {
    throw createDBNotFoundError('Destination not found');
  }

  return res.json({
    ...destination,
    destinationId: Number(destination.destinationId),
    averageTemperatureLow: String(destination.averageTemperatureLow),
    averageTemperatureHigh: String(destination.averageTemperatureHigh),
    safetyRating: String(destination.safetyRating),
  });
};
