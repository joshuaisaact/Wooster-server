import { and, eq, sql } from 'drizzle-orm';
import { executeDbOperation } from './db-utils';
import { db, itineraryDays } from '../db';
import { logger } from './logger';

export const updateExistingActivitiesWithSlots = async () => {
  return executeDbOperation(async () => {
    // First get all trip/day combinations that have activities
    const tripDays = await db
      .select({
        tripId: itineraryDays.tripId,
        dayNumber: itineraryDays.dayNumber,
      })
      .from(itineraryDays)
      .where(
        sql`${itineraryDays.tripId} IS NOT NULL AND ${itineraryDays.dayNumber} IS NOT NULL`,
      )
      .groupBy(itineraryDays.tripId, itineraryDays.dayNumber);

    for (const { tripId, dayNumber } of tripDays) {
      if (tripId === null || dayNumber === null) continue;

      // Get activities for this day ordered by creation time
      const dayActivities = await db
        .select({
          dayId: itineraryDays.dayId,
        })
        .from(itineraryDays)
        .where(
          and(
            sql`${itineraryDays.tripId} = ${tripId}`,
            sql`${itineraryDays.dayNumber} = ${dayNumber}`,
          ),
        )
        .orderBy(itineraryDays.createdAt);

      // Update each activity with its slot number (1-based index)
      const updates = dayActivities.map((activity, index) => {
        return db
          .update(itineraryDays)
          .set({ slotNumber: index + 1 })
          .where(eq(itineraryDays.dayId, activity.dayId));
      });

      await Promise.all(updates);
    }

    logger.info('Successfully updated all activities with slot numbers');
  }, 'Error updating activities with slot numbers');
};
