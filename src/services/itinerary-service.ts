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

// export const insertItineraryDays = async (
//   tripId: number,
//   itinerary: DayItinerary[],
//   activityIds: number[][],
// ) => {
//   for (let i = 0; i < itinerary.length; i++) {
//     const dayNumber = i + 1;
//     for (const activityId of activityIds[i]) {
//       const { error } = await supabase
//         .from('itinerary_days')
//         .insert([
//           { trip_id: tripId, day_number: dayNumber, activity_id: activityId },
//         ]);

//       if (error) {
//         throw new Error(
//           `Error inserting itinerary day ${dayNumber}: ${error.message}`,
//         );
//       }
//     }
//   }
// };
