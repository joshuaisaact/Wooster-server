import { Request, Response } from 'express';
import { DayItinerary } from '../../types/trip-types';
import { addTrip, validateTripInput } from '../../services/trip-service';
import { generateTripItinerary } from '../../services/google-ai-service';
import {
  findDestinationByName,
  generateNewDestination,
  addDestination,
} from '../../services/destination-service';
import { addItineraryDays } from '../../services/itinerary-service';
import { addActivities } from '../../services/activity-service';
import { createPrompt } from '../../config/trip-prompt-template';
import { eq } from 'drizzle-orm';
import { db, destinations } from '../../db';

interface CreateTripRequestBody {
  days: number;
  location: string;
  startDate: string;
}

// Helper function to get existing destination or create new one
async function getOrCreateDestination(location: string): Promise<number> {
  try {
    // First try to find existing destination
    const existingDestination = await findDestinationByName(location);

    if (existingDestination) {
      console.log('Found existing destination:', location);
      return existingDestination.destinationId;
    }

    // If not found, generate and create new destination
    console.log('Generating new destination:', location);
    const destinationData = await generateNewDestination(location);
    const newDestination = await addDestination(destinationData);
    return newDestination.destinationId;
  } catch (error) {
    throw {
      status: 500,
      message: `Failed to process destination: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

// Helper function to generate and parse itinerary
async function generateItinerary(
  days: number,
  location: string,
  startDate: string,
): Promise<DayItinerary[]> {
  const prompt = createPrompt(days, location, startDate);
  const itineraryText = await generateTripItinerary(prompt);

  try {
    return JSON.parse(itineraryText);
  } catch (error) {
    console.error('Failed to generate or parse itinerary:', error);
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
    const { days, location, startDate } = req.body;
    const userId = req.user!.id;

    if (!validateTripInput(days, location, startDate)) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      // Get or create destination
      const destinationId = await getOrCreateDestination(location);

      // Fetch the full destination data from the database
      const [destinationData] = await db
        .select()
        .from(destinations)
        .where(eq(destinations.destinationId, destinationId));

      if (!destinationData) {
        throw new Error('Failed to fetch destination data');
      }

      // Generate itinerary
      const itinerary = await generateItinerary(days, location, startDate);

      // Create trip in database
      const tripId = await createTripInDB(
        userId,
        destinationId,
        startDate,
        days,
        itinerary,
      );

      // Return success response with properly structured data
      return res.status(201).json({
        message: 'Trip created successfully',
        trip: {
          tripId: tripId.toString(),
          destination: {
            destinationId: destinationData.destinationId,
            destinationName: destinationData.destinationName,
            latitude: destinationData.latitude || '',
            longitude: destinationData.longitude || '',
            description: destinationData.description || '',
            country: destinationData.country || '',
            bestTimeToVisit: destinationData.bestTimeToVisit || '',
            averageTemperatureLow: destinationData.averageTemperatureLow || '',
            averageTemperatureHigh:
              destinationData.averageTemperatureHigh || '',
            popularActivities: destinationData.popularActivities || '',
            travelTips: destinationData.travelTips || '',
            nearbyAttractions: destinationData.nearbyAttractions || '',
            transportationOptions: destinationData.transportationOptions || '',
            accessibilityInfo: destinationData.accessibilityInfo || '',
            officialLanguage: destinationData.officialLanguage || '',
            currency: destinationData.currency || '',
            localCuisine: destinationData.localCuisine || '',
            costLevel: destinationData.costLevel || '',
            safetyRating: destinationData.safetyRating || '',
            culturalSignificance: destinationData.culturalSignificance || '',
            userRatings: destinationData.userRatings || '',
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
      console.error('Error in handleAddTrip:', error);

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
  } catch (error) {
    console.error('Error creating new trip:', error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};
