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
      }));

      // Insert activities using Drizzle ORM and return the activity IDs
      const insertedActivities = await db
        .insert(activities)
        .values(activityData)
        .returning({ activityId: activities.activityId });

      // Returning the array of inserted activity IDs
      return insertedActivities.map((activity) => activity.activityId);
    }),
  );
};
