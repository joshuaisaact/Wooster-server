import { eq } from 'drizzle-orm';
import { db, trips } from '../../db';
import { activities } from '../../db/tables/activities';
import { destinations } from '../../db/tables/destinations';
import { itineraryDays } from '../../db/tables/itinerary_days';

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
    console.log('Raw trip data:', tripData[0]?.activities);
    return tripData;
  } catch (error) {
    throw new Error(
      `Error fetching trips: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`,
    );
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

    return insertedTrip.tripId;
  } catch (error) {
    throw new Error(
      `Failed to insert trip: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
};

export const deleteTripById = async (tripId: number) => {
  try {
    const deletedTrips = await db
      .delete(trips)
      .where(eq(trips.tripId, tripId))
      .returning();

    // Check if any rows were deleted
    if (deletedTrips.length === 0) {
      throw new Error(`No trip found with ID ${tripId}`);
    }

    return deletedTrips.length;
  } catch (error) {
    throw new Error(
      `Error deleting trip with ID ${tripId}: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
};

export const validateTripInput = (
  days: number,
  location: string,
  start_date: string,
): boolean => {
  return days > 0 && !!location && !!start_date;
};