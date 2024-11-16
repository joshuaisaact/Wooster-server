import { and, eq } from 'drizzle-orm';
import { activities, db, destinations, itineraryDays, trips } from '../../db';
import { createDBQueryError, createDBNotFoundError } from '../../types/errors';
import { logger } from '../../utils/logger';

export const fetchTripsFromDB = async (userId: string) => {
  try {
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
  } catch (error) {
    logger.error({ error, userId }, 'Error fetching trips');
    throw createDBQueryError('Error fetching trips', {
      originalError: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const addTrip = async (
  userId: string,
  destinationId: number,
  startDate: string,
  numDays: number,
) => {
  try {
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
  } catch (error) {
    logger.error(
      { error, userId, destinationId, startDate, numDays },
      'Error inserting trip',
    );
    throw createDBQueryError('Failed to insert trip', {
      originalError: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const deleteTripById = async (tripId: number) => {
  try {
    const deletedTrips = await db
      .delete(trips)
      .where(eq(trips.tripId, tripId))
      .returning();

    if (deletedTrips.length === 0) {
      const errorMessage = `No trip found with ID ${tripId}`;
      logger.warn({ tripId }, errorMessage);
      throw createDBNotFoundError(errorMessage, { tripId });
    }

    logger.info({ tripId }, 'Deleted trip successfully');
    return deletedTrips.length;
  } catch (error) {
    logger.error({ error, tripId }, 'Error deleting trip');
    throw createDBQueryError(`Error deleting trip with ID ${tripId}`, {
      originalError: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const fetchTripFromDB = async (tripId: string, userId: string) => {
  try {
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
  } catch (error) {
    logger.error({ error, tripId, userId }, 'Error fetching trip');
    throw createDBQueryError('Error fetching trip', {
      originalError: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
