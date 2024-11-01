import { db } from '../db';
import { activities } from '../db';
import { DayItinerary } from '../types/trip-types';

export const addActivities = async (
  itinerary: DayItinerary[],
  destinationId: number,
) => {
  return Promise.all(
    itinerary.map(async (day) => {
      const activityData = day.activities.map((activity) => ({
        locationId: destinationId,
        activityName: activity.activityName,
        latitude: activity.latitude,
        longitude: activity.longitude,
        price: activity.price,
        location: activity.location,
        description: activity.description,
        duration: activity.duration,
        difficulty: activity.difficulty,
        category: activity.category,
        bestTime: activity.bestTime,
      }));

      const insertedActivities = await db
        .insert(activities)
        .values(activityData)
        .returning({ activityId: activities.activityId });

      return insertedActivities.map((activity) => activity.activityId);
    }),
  );
};
