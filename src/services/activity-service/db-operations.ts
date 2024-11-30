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
        );

      // Validate that all activities exist in this day
      const currentActivityIds = new Set<number>(
        currentActivities
          .map((a) => a.activityId ?? -1)
          .filter((id) => id !== -1),
      );

      // Validate that all activities exist in this day
      const allActivitiesExist = updates.every((u) =>
        currentActivityIds.has(u.activityId),
      );

      if (!allActivitiesExist) {
        throw createDBQueryError('Some activities do not exist in this day', {
          updates,
          existingActivities: currentActivityIds,
        });
      }

      // Update slots in a transaction
      await db.transaction(async (tx) => {
        const updatePromises = updates.map(({ activityId, slotNumber }) => {
          const activity = currentActivities.find(
            (a) => a.activityId === activityId,
          );
          if (!activity) return Promise.resolve(); // Should never happen due to earlier validation

          return tx
            .update(itineraryDays)
            .set({ slotNumber })
            .where(eq(itineraryDays.dayId, activity.dayId));
        });

        await Promise.all(updatePromises);
      });

      // Return updated activities
      return db
        .select({
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
    },
    'Error reordering activities',
    { context: { tripId, dayNumber, updates } },
  );
};

// We'll also need to properly move these functions from trip-service
export const addActivities = async (/* params */) => {
  // Move from trip service
};

export const getActivitiesForDay = async (/* params */) => {
  // Move from trip service
};
