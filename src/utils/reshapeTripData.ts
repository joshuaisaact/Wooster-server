/* eslint-disable @typescript-eslint/no-explicit-any */
// import { DBTrip, ItineraryDay } from '../types/tripTypes';

// interface Tript {
//   trip_id: number;
//   destination_id: number;
//   start_date: string; // Use Date if you're parsing it later
//   num_days: number | null;
//   destination_name: string; // Added here
//   itinerary_days: ItineraryDay[]; // Define ItineraryDay as needed
// }

// TODO REFACTOR TO TYPES

function reshapeTripData(dbData: any) {
  return dbData.map((trip: any) => ({
    trip_id: trip.trip_id.toString(),
    start_date: trip.start_date,
    num_days: trip.num_days,
    destination_name: trip.destinations.destination_name, // Move destination_name up
    itinerary: convertActivities(trip.itinerary_days),
  }));
}

function convertActivities(data: any) {
  const result: any[] = [];

  data.forEach((item: any) => {
    const { day_number, activities } = item;
    const dayEntry = result.find((entry) => entry.day === day_number);

    if (dayEntry) {
      dayEntry.activities.push({
        activity_name: activities.activity_name,
        description: activities.description,
        location: activities.location,
        price: activities.price,
        latitude: activities.latitude,
        longitude: activities.longitude,
      });
    } else {
      result.push({
        day: day_number,
        activities: [
          {
            activity_name: activities.activity_name,
            description: activities.description,
            location: activities.location,
            price: activities.price,
            latitude: activities.latitude,
            longitude: activities.longitude,
          },
        ],
      });
    }
  });

  return result;
}

export default reshapeTripData;
