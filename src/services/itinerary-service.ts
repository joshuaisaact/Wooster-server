import supabase from '../models/supabase-client';
import { DayItinerary } from '../types/trip-types';

export const insertItineraryDays = async (
  tripId: number,
  itinerary: DayItinerary[],
  activityIds: number[][],
) => {
  for (let i = 0; i < itinerary.length; i++) {
    const dayNumber = i + 1;
    for (const activityId of activityIds[i]) {
      const { error } = await supabase
        .from('itinerary_days')
        .insert([
          { trip_id: tripId, day_number: dayNumber, activity_id: activityId },
        ]);

      if (error) {
        throw new Error(
          `Error inserting itinerary day ${dayNumber}: ${error.message}`,
        );
      }
    }
  }
};
