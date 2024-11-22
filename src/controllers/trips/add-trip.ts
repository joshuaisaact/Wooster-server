import { Request, Response } from 'express';
import { createTripInDB, validateTripInput } from '../../services/trip-service';
import { generateTripItinerary } from '../../services/llm/generators/trip';
import { logger } from '../../utils/logger';
import { getOrCreateDestination } from '../../services/destination-service';

interface CreateTripRequestBody {
  days: number;
  location: string;
  startDate: string;
  selectedCategories?: string[];
}

export const handleAddTrip = async (
  req: Request<object, object, CreateTripRequestBody>,
  res: Response,
) => {
  const { days, location, startDate, selectedCategories } = req.body;
  const userId = req.user!.id;

  if (!validateTripInput(days, location, startDate)) {
    return res.status(400).json({
      error: 'Missing required fields',
    });
  }

  const destination = await getOrCreateDestination(location);

  const trip = await generateTripItinerary(
    days,
    location,
    startDate,
    selectedCategories,
  );

  const tripId = await createTripInDB(
    userId,
    destination.destinationId,
    startDate,
    days,
    trip.itinerary,
  );

  logger.info(`Trip created successfully with tripId: ${tripId}`);

  return res.status(201).json({
    message: 'Trip created successfully',
    trip: {
      tripId: tripId.toString(),
      destination,
      numDays: days,
      startDate,
      itinerary: trip.itinerary.map((day) => ({
        day: day.day,
        activities: day.activities || [],
      })),
    },
  });
};
