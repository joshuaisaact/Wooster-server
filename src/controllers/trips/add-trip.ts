import { Request, Response } from 'express';
import { DayItinerary } from '../../types/trip-types';
import { addTrip, validateTripInput } from '../../services/trip-service';
import { generateTripItinerary } from '../../services/google-ai-service';
import { addItineraryDays } from '../../services/itinerary-service';
import { addActivities } from '../../services/activity-service';
import { createPrompt } from '../../config/trip-prompt-template';
import { logger } from '../../utils/logger';
import { getOrCreateDestination } from '../../services/destination-service';

interface CreateTripRequestBody {
  days: number;
  location: string;
  startDate: string;
  selectedCategories?: string[];
}

// Helper function to generate and parse itinerary
async function generateItinerary(
  days: number,
  location: string,
  startDate: string,
  selectedCategories?: string[],
): Promise<DayItinerary[]> {
  const prompt = createPrompt(days, location, startDate, selectedCategories); // Updated this line

  try {
    const itineraryText = await generateTripItinerary(prompt);
    return JSON.parse(itineraryText);
  } catch (error) {
    logger.error('Failed to generate or parse itinerary:', error);
    throw {
      status: 500,
      message: 'Failed to parse itinerary',
    };
  }
}

// Helper function to create trip in database
async function createTripInDB(
  userId: string,
  destinationId: number,
  startDate: string,
  days: number,
  itinerary: DayItinerary[],
): Promise<number> {
  const tripId = await addTrip(userId, destinationId, startDate, days);
  const activityIds = await addActivities(itinerary, destinationId);
  await addItineraryDays(tripId, itinerary, activityIds);
  return tripId;
}

export const handleAddTrip = async (
  req: Request<object, object, CreateTripRequestBody>,
  res: Response,
) => {
  try {
    const { days, location, startDate, selectedCategories } = req.body;
    const userId = req.user!.id;

    if (!validateTripInput(days, location, startDate)) {
      return res.status(400).json({
        error: 'Missing required fields',
      });
    }

    const destination = await getOrCreateDestination(location);

    const itinerary = await generateItinerary(
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
      itinerary,
    );

    logger.info(`Trip created successfully with tripId: ${tripId}`);
    return res.status(201).json({
      message: 'Trip created successfully',
      trip: {
        tripId: tripId.toString(),
        destination: {
          destinationId: destination.destinationId,
          destinationName: destination.destinationName,
          latitude: destination.latitude || '',
          longitude: destination.longitude || '',
          description: destination.description || '',
          country: destination.country || '',
          bestTimeToVisit: destination.bestTimeToVisit || '',
          averageTemperatureLow: destination.averageTemperatureLow || '',
          averageTemperatureHigh: destination.averageTemperatureHigh || '',
          popularActivities: destination.popularActivities || '',
          travelTips: destination.travelTips || '',
          nearbyAttractions: destination.nearbyAttractions || '',
          transportationOptions: destination.transportationOptions || '',
          accessibilityInfo: destination.accessibilityInfo || '',
          officialLanguage: destination.officialLanguage || '',
          currency: destination.currency || '',
          localCuisine: destination.localCuisine || '',
          costLevel: destination.costLevel || '',
          safetyRating: destination.safetyRating || '',
          culturalSignificance: destination.culturalSignificance || '',
          userRatings: destination.userRatings || '',
        },
        numDays: days,
        startDate,
        itinerary: itinerary.map((day) => ({
          day: day.day,
          activities: day.activities || [],
        })),
      },
    });
  } catch (error: unknown) {
    logger.error('Error in handleAddTrip:', error);

    if (
      error &&
      typeof error === 'object' &&
      'status' in error &&
      'message' in error
    ) {
      const typedError = error as { status: number; message: string };
      return res.status(typedError.status).json({
        error: typedError.message,
      });
    }

    return res.status(500).json({
      error: 'An unexpected error occurred',
    });
  }
};
