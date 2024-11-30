import { eq } from 'drizzle-orm';
import { db, itineraryDays } from '../db';
import { DayItinerary } from '../types/trip-types';

import { logger } from '../utils/logger';
import {
  createDBQueryError,
  createValidationError,
} from '../utils/error-handlers';

interface ItineraryDayData {
  tripId: number;
  dayNumber: number;
  activityId: number;
  slotNumber: number;
}

export const addItineraryDays = async (
  tripId: number,
  itinerary: DayItinerary[],
  activityIds: number[][],
) => {
  if (!itinerary || itinerary.length === 0) {
    const errorMessage = 'Itinerary cannot be empty';
    logger.warn({ tripId, itinerary }, errorMessage);
    throw createValidationError(errorMessage, { tripId, itinerary });
  }

  if (itinerary.length !== activityIds.length) {
    const errorMessage = 'Activity IDs must match itinerary length';
    logger.warn({ tripId, itinerary, activityIds }, errorMessage);
    throw createValidationError(errorMessage, {
      tripId,
      itinerary,
      activityIds,
    });
  }

  const itineraryDaysData: ItineraryDayData[] = [];

  for (let i = 0; i < itinerary.length; i++) {
    const dayNumber = i + 1;

    if (!activityIds[i] || activityIds[i].length === 0) {
      const errorMessage = `No activity IDs provided for day ${dayNumber}`;
      logger.warn({ tripId, dayNumber }, errorMessage);
      throw createValidationError(errorMessage, { tripId, dayNumber });
    }

    activityIds[i].forEach((activityId, slotIndex) => {
      itineraryDaysData.push({
        tripId,
        dayNumber,
        activityId,
        slotNumber: slotIndex + 1,
      });
    });
  }

  try {
    await db.insert(itineraryDays).values(itineraryDaysData);
    logger.info(
      { tripId, itineraryDaysData },
      'Inserted itinerary days successfully',
    );
  } catch (error) {
    const errorMessage = 'Error inserting itinerary days';
    logger.error({ error, tripId, itineraryDaysData }, errorMessage);
    throw createDBQueryError(errorMessage, {
      originalError: error instanceof Error ? error.message : 'Unknown error',
      tripId,
      itineraryDaysData,
    });
  }
};

export const deleteItineraryDaysByTripId = async (tripId: number) => {
  if (!tripId || tripId <= 0) {
    const errorMessage = 'Invalid trip ID provided';
    logger.warn({ tripId }, errorMessage);
    throw createValidationError(errorMessage, { tripId });
  }

  try {
    const result = await db
      .delete(itineraryDays)
      .where(eq(itineraryDays.tripId, tripId));

    if (result.count === 0) {
      const errorMessage = `No itinerary days found for trip ID ${tripId}`;
      logger.warn({ tripId }, errorMessage);
      throw createDBQueryError(errorMessage, { tripId });
    }

    logger.info({ tripId }, 'Deleted itinerary days successfully');
  } catch (error) {
    const errorMessage = `Error deleting itinerary days for trip ${tripId}`;
    logger.error({ error, tripId }, errorMessage);
    throw createDBQueryError(errorMessage, {
      originalError: error instanceof Error ? error.message : 'Unknown error',
      tripId,
    });
  }
};
