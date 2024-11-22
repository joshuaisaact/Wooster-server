import { and, eq } from 'drizzle-orm';
import { activities, db, destinations, itineraryDays, trips } from '../../db';

import { logger } from '../../utils/logger';
import {
  createDBNotFoundError,
  createDBQueryError,
} from '@/utils/error-handlers';
import { DayItinerary } from '@/types/trip-types';
import { addActivities } from '../activity-service';
import { addItineraryDays } from '../itinerary-service';
import { executeDbOperation } from '@/utils/db-utils';

export const fetchTripsFromDB = (userId: string) =>
  executeDbOperation(
    async () => {
      const tripData = await db
        .select({
          tripId: trips.tripId,
          destinationId: trips.destinationId,
          startDate: trips.startDate,
          numDays: trips.numDays,
          itineraryDays: itineraryDays.dayNumber,
          activities: {
            activityId: activities.activityId,
            activityName: activities.activityName,
            latitude: activities.latitude,
            longitude: activities.longitude,
            price: activities.price,
            location: activities.location,
            description: activities.description,
            duration: activities.duration,
            difficulty: activities.difficulty,
            category: activities.category,
            bestTime: activities.bestTime,
          },
          destination: {
            destinationId: destinations.destinationId,
            destinationName: destinations.destinationName,
            latitude: destinations.latitude,
            longitude: destinations.longitude,
            description: destinations.description,
            country: destinations.country,
            createdAt: destinations.createdAt,
            popularActivities: destinations.popularActivities,
            travelTips: destinations.travelTips,
            nearbyAttractions: destinations.nearbyAttractions,
            transportationOptions: destinations.transportationOptions,
            accessibilityInfo: destinations.accessibilityInfo,
            officialLanguage: destinations.officialLanguage,
            currency: destinations.currency,
            localCuisine: destinations.localCuisine,
            costLevel: destinations.costLevel,
            safetyRating: destinations.safetyRating,
            culturalSignificance: destinations.culturalSignificance,
            userRatings: destinations.userRatings,
            bestTimeToVisit: destinations.bestTimeToVisit,
            averageTemperatureLow: destinations.averageTemperatureLow,
            averageTemperatureHigh: destinations.averageTemperatureHigh,
          },
        })
        .from(trips)
        .where(eq(trips.userId, userId))
        .leftJoin(
          destinations,
          eq(destinations.destinationId, trips.destinationId),
        )
        .leftJoin(itineraryDays, eq(itineraryDays.tripId, trips.tripId))
        .leftJoin(
          activities,
          eq(activities.activityId, itineraryDays.activityId),
        );

      logger.info({ userId }, 'Fetched trips successfully');
      return tripData;
    },
    'Error fetching trips',
    { context: { userId } },
  );

export const addTrip = (
  userId: string,
  destinationId: number,
  startDate: string,
  numDays: number,
) =>
  executeDbOperation(
    async () => {
      const startDateAsDate = new Date(startDate);

      const [insertedTrip] = await db
        .insert(trips)
        .values({
          userId,
          destinationId,
          startDate: startDateAsDate,
          numDays,
        })
        .returning({ tripId: trips.tripId });

      logger.info(
        { userId, destinationId, startDate, numDays },
        'Inserted trip successfully',
      );
      return insertedTrip.tripId;
    },
    'Failed to insert trip',
    { context: { userId, destinationId, startDate, numDays } },
  );

export const deleteTripById = (tripId: number) =>
  executeDbOperation(
    async () => {
      const deletedTrips = await db
        .delete(trips)
        .where(eq(trips.tripId, tripId))
        .returning();

      if (deletedTrips.length === 0) {
        throw createDBNotFoundError(`No trip found with ID ${tripId}`, {
          tripId,
        });
      }

      logger.info({ tripId }, 'Deleted trip successfully');
      return deletedTrips.length;
    },
    'Error deleting trip',
    { context: { tripId } },
  );

export const fetchTripFromDB = (tripId: string, userId: string) =>
  executeDbOperation(
    async () => {
      const parsedTripId = parseInt(tripId, 10);

      if (isNaN(parsedTripId)) {
        const errorMessage = 'Invalid trip ID';
        logger.warn({ tripId }, errorMessage);
        throw createDBQueryError(errorMessage, { tripId });
      }

      const tripData = await db
        .select({
          tripId: trips.tripId,
          destinationId: trips.destinationId,
          startDate: trips.startDate,
          numDays: trips.numDays,
          itineraryDays: itineraryDays.dayNumber,
          activities: {
            activityId: activities.activityId,
            activityName: activities.activityName,
            latitude: activities.latitude,
            longitude: activities.longitude,
            price: activities.price,
            location: activities.location,
            description: activities.description,
            duration: activities.duration,
            difficulty: activities.difficulty,
            category: activities.category,
            bestTime: activities.bestTime,
          },
          destination: {
            destinationId: destinations.destinationId,
            destinationName: destinations.destinationName,
            latitude: destinations.latitude,
            longitude: destinations.longitude,
            description: destinations.description,
            country: destinations.country,
            createdAt: destinations.createdAt,
            popularActivities: destinations.popularActivities,
            travelTips: destinations.travelTips,
            nearbyAttractions: destinations.nearbyAttractions,
            transportationOptions: destinations.transportationOptions,
            accessibilityInfo: destinations.accessibilityInfo,
            officialLanguage: destinations.officialLanguage,
            currency: destinations.currency,
            localCuisine: destinations.localCuisine,
            costLevel: destinations.costLevel,
            safetyRating: destinations.safetyRating,
            culturalSignificance: destinations.culturalSignificance,
            userRatings: destinations.userRatings,
            bestTimeToVisit: destinations.bestTimeToVisit,
            averageTemperatureLow: destinations.averageTemperatureLow,
            averageTemperatureHigh: destinations.averageTemperatureHigh,
          },
        })
        .from(trips)
        .where(and(eq(trips.tripId, parsedTripId), eq(trips.userId, userId)))
        .leftJoin(
          destinations,
          eq(destinations.destinationId, trips.destinationId),
        )
        .leftJoin(itineraryDays, eq(itineraryDays.tripId, trips.tripId))
        .leftJoin(
          activities,
          eq(activities.activityId, itineraryDays.activityId),
        );

      if (!tripData.length) {
        const errorMessage = 'Trip not found';
        logger.warn({ tripId, userId }, errorMessage);
        throw createDBNotFoundError(errorMessage, { tripId, userId });
      }

      logger.info({ tripId, userId }, 'Fetched trip successfully');
      return tripData[0];
    },
    'Error fetching trip',
    { context: { tripId, userId } },
  );

// Helper function to create trip in database
export async function createTripInDB(
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
