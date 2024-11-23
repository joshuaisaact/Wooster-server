import { db } from '../db';
import { activities } from '../db';
import { DayItinerary } from '../types/trip-types';

export const addActivities = async (
  itinerary: DayItinerary[],
  destinationId: number,
) => {
  if (!itinerary || !Array.isArray(itinerary)) {
    return [[]];
  }

  return Promise.all(
    itinerary.map(async (day) => {
      if (!day.activities || !Array.isArray(day.activities)) {
        console.log('Invalid day activities:', day);
        return [];
      }

      const activityData = day.activities.map((activity) => ({
        locationId: destinationId,
        activityName: activity.activityName?.toString() || null,

        latitude: activity.latitude?.toString() || null,
        longitude: activity.longitude?.toString() || null,
        price: activity.price?.toString() || null,
        location: activity.location?.toString() || null,
        description: activity.description?.toString() || null,
        duration: activity.duration?.toString() || null,

        difficulty: activity.difficulty,
        category: activity.category,
        bestTime: activity.bestTime,
      }));

      console.log('Inserting activity data:', activityData);

      const insertedActivities = await db
        .insert(activities)
        .values(activityData)
        .returning({ activityId: activities.activityId });

      return insertedActivities.map((activity) => activity.activityId);
    }),
  );
};
