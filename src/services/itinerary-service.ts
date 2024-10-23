import { eq } from 'drizzle-orm';
import { db, itineraryDays } from '../db';
import { DayItinerary } from '../types/trip-types';

export const addItineraryDays = async (
  tripId: number,
  itinerary: DayItinerary[],
  activityIds: number[][],
) => {
  const itineraryDaysData = [];

  // Collect all the entries to insert in one go
  for (let i = 0; i < itinerary.length; i++) {
    const dayNumber = i + 1;
    for (const activityId of activityIds[i]) {
      itineraryDaysData.push({
        tripId,
        dayNumber,
        activityId,
      });
    }
  }

  // Insert all records into the `itinerary_days` table in one batch
  try {
    await db.insert(itineraryDays).values(itineraryDaysData);
  } catch (error) {
    throw new Error(
      `Error inserting itinerary days: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`,
    );
  }
};

export const deleteItineraryDaysByTripId = async (tripId: number) => {
  try {
    await db.delete(itineraryDays).where(eq(itineraryDays.tripId, tripId));
  } catch (error) {
    throw new Error(
      `Error deleting itinerary days for trip ${tripId}: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
};
