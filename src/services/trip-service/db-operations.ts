import { and, eq } from 'drizzle-orm';
import { activities, db, destinations, itineraryDays, trips } from '../../db';

import { logger } from '../../utils/logger';
import {
  createDBNotFoundError,
  createDBQueryError,
} from '../../utils/error-handlers';
import { DayItinerary } from '@/types/trip-types';
import { addActivities } from '../activity-service';
import { addItineraryDays } from '../itinerary-service';
import { executeDbOperation } from '../../utils/db-utils';
import reshapeTripData from '../../utils/reshape-trip-data-drizzle';

export const fetchTripsFromDB = (userId: string) =>
  executeDbOperation(
    async () => {
      const tripData = await db
        .select({
          tripId: trips.tripId,
          destinationId: trips.destinationId,
          startDate: trips.startDate,
          numDays: trips.numDays,
          title: trips.title,
          description: trips.description,
          status: trips.status,
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

      const reshapedTrips = reshapeTripData(tripData);

      logger.info('Fetched trips successfully');
      return reshapedTrips;
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
          title: trips.title,
          description: trips.description,
          status: trips.status,
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

      const reshapedTrips = reshapeTripData(tripData);

      console.log(tripData);
      logger.info({ tripId, userId }, 'Fetched trip successfully');
      return reshapedTrips;
    },
    'Error fetching trip',
    { context: { tripId, userId } },
  );

interface UpdateFields {
  startDate?: Date;
  title?: string;
  description?: string;
  status?: string;
}

export const updateTripInDB = async (
  tripId: string,
  updates: {
    startDate?: string;
    title?: string;
    description?: string;
    status?: string;
  },
) => {
  return executeDbOperation(
    async () => {
      const parsedTripId = parseInt(tripId, 10);
      if (isNaN(parsedTripId)) {
        throw createDBQueryError('Invalid trip ID', { tripId });
      }

      const updateFields: UpdateFields = {};
      if (updates.startDate) {
        updateFields.startDate = new Date(updates.startDate);
      }
      if (updates.title) {
        updateFields.title = updates.title;
      }
      if (updates.description) {
        updateFields.description = updates.description;
      }

      if (updates.status) {
        updateFields.status = updates.status;
      }

      const [updatedTrip] = await db
        .update(trips)
        .set(updateFields)
        .where(eq(trips.tripId, parsedTripId))
        .returning({
          tripId: trips.tripId,
          startDate: trips.startDate,
          title: trips.title,
          description: trips.description,
          status: trips.status,
        });

      if (!updatedTrip) {
        throw createDBNotFoundError(`No trip found with ID ${tripId}`, {
          tripId,
        });
      }

      logger.info({ tripId, updates }, 'Trip updated successfully');
      return updatedTrip;
    },
    'Error updating trip',
    { context: { tripId, updates } },
  );
};

// Helper function to create trip in database
export async function createTripInDB(
  userId: string,
  destinationId: number,
  startDate: string,
  days: number,
  itinerary: DayItinerary[],
): Promise<number> {
  console.log('createTripInDB itinerary:', JSON.stringify(itinerary, null, 2));
  const tripId = await addTrip(userId, destinationId, startDate, days);
  console.log('Created trip with ID:', tripId);

  console.log('About to call addActivities with:', {
    itineraryType: typeof itinerary,
    isArray: Array.isArray(itinerary),
    length: itinerary?.length,
  });

  const activityIds = await addActivities(itinerary, destinationId);
  await addItineraryDays(tripId, itinerary, activityIds);
  return tripId;
}
