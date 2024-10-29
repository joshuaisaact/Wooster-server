import { eq } from 'drizzle-orm';
import { db, itineraryDays } from '../db';
import { DayItinerary } from '../types/trip-types';

export const addItineraryDays = async (
  tripId: number,
  itinerary: DayItinerary[],
  activityIds: number[][],
) => {
  if (!itinerary || itinerary.length === 0) {
    throw new Error('Itinerary cannot be empty');
  }

  if (itinerary.length !== activityIds.length) {
    throw new Error('Activity IDs must match itinerary length');
  }

  const itineraryDaysData = [];

  // Collect all the entries to insert in one go
  for (let i = 0; i < itinerary.length; i++) {
    const dayNumber = i + 1;

    if (!activityIds[i] || activityIds[i].length === 0) {
      throw new Error(`No activity IDs provided for day ${dayNumber}`);
    }

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
  if (!tripId || tripId <= 0) {
    throw new Error('Invalid trip ID provided');
  }

  try {
    const result = await db
      .delete(itineraryDays)
      .where(eq(itineraryDays.tripId, tripId));

    // Optionally check if any rows were deleted and handle accordingly
    if (result.count === 0) {
      throw new Error(`No itinerary days found for trip ID ${tripId}`);
    }
  } catch (error) {
    throw new Error(
      `Error deleting itinerary days for trip ${tripId}: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
};
