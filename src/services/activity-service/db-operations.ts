import { and, eq, sql } from 'drizzle-orm';
import { activities, db, itineraryDays } from '../../db';
import { executeDbOperation } from '../../utils/db-utils';
import { createDBQueryError } from '../../utils/error-handlers';

export const reorderActivities = async (
  tripId: number,
  dayNumber: number,
  updates: Array<{ activityId: number; slotNumber: number }>,
) => {
  return executeDbOperation(
    async () => {
      // Validate slot numbers
      const validSlots = updates.every(
        (u) => u.slotNumber >= 1 && u.slotNumber <= 3,
      );
      if (!validSlots) {
        throw createDBQueryError('Slot numbers must be between 1 and 3', {
          updates,
        });
      }

      // Check for duplicate slots
      const slots = new Set(updates.map((u) => u.slotNumber));
      if (slots.size !== updates.length) {
        throw createDBQueryError('Duplicate slot numbers are not allowed', {
          updates,
        });
      }

      // Get current activities for this day
      const currentActivities = await db
        .select({
          activityId: activities.activityId,
          dayId: itineraryDays.dayId,
          slotNumber: itineraryDays.slotNumber,
        })
        .from(itineraryDays)
        .where(
          and(
            sql`${itineraryDays.tripId} = ${tripId}`,
            sql`${itineraryDays.dayNumber} = ${dayNumber}`,
          ),
        )
        .leftJoin(
          activities,
          eq(activities.activityId, itineraryDays.activityId),
        );

      const currentActivityIds = new Set<number>(
        currentActivities
          .map((a) => a.activityId ?? -1)
          .filter((id) => id !== -1),
      );

      const allActivitiesExist = updates.every((u) =>
        currentActivityIds.has(u.activityId),
      );

      if (!allActivitiesExist) {
        throw createDBQueryError('Some activities do not exist in this day', {
          updates,
          existingActivities: Array.from(currentActivityIds),
        });
      }

      // Update slots in a transaction
      await db.transaction(async (tx) => {
        const updatePromises = updates.map(({ activityId, slotNumber }) => {
          const activity = currentActivities.find(
            (a) => a.activityId === activityId,
          );
          if (!activity) return Promise.resolve();

          return tx
            .update(itineraryDays)
            .set({ slotNumber })
            .where(eq(itineraryDays.dayId, activity.dayId));
        });

        await Promise.all(updatePromises);
      });

      // Return only the updated activities for this specific day
      const updatedActivities = await db
        .select({
          activityId: activities.activityId,
          activityName: activities.activityName,
          description: activities.description,
          location: activities.location,
          price: activities.price,
          duration: activities.duration,
          latitude: activities.latitude,
          longitude: activities.longitude,
          difficulty: activities.difficulty,
          category: activities.category,
          bestTime: activities.bestTime,
          slotNumber: itineraryDays.slotNumber,
        })
        .from(itineraryDays)
        .where(
          and(
            sql`${itineraryDays.tripId} = ${tripId}`,
            sql`${itineraryDays.dayNumber} = ${dayNumber}`,
          ),
        )
        .leftJoin(
          activities,
          eq(activities.activityId, itineraryDays.activityId),
        )
        .orderBy(itineraryDays.slotNumber);

      return updatedActivities;
    },
    'Error reordering activities',
    { context: { tripId, dayNumber, updates } },
  );
};
