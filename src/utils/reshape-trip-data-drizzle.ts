import { DBActivity, TripDBRow, DBItineraryDay } from '../types/db-types';

// Reshape the data returned by Drizzle ORM
function reshapeTripData(dbData: TripDBRow[]) {
  const tripsMap: any = {};

  dbData.forEach((row: TripDBRow) => {
    // If the trip is not yet in tripsMap, add it
    if (!tripsMap[row.tripId]) {
      tripsMap[row.tripId] = {
        tripId: row.tripId.toString(),
        startDate: row.startDate,
        numDays: row.numDays,
        destinationName:
          row.destination?.destinationName || 'Unknown Destination',
        itinerary: [],
      };
    } else {
      console.log(`Trip with tripId ${row.tripId} already exists.`);
    }

    // Handle itinerary day grouping
    const itineraryDay = tripsMap[row.tripId].itinerary.find(
      (day: DBItineraryDay) => {
        return day.day === row.itineraryDays;
      },
    );

    const activity: DBActivity | null =
      row.activities && row.activities.activityId
        ? {
            activityId: row.activities.activityId,
            activityName: row.activities.activityName,
            description: row.activities.description,
            location: row.activities.location,
            price: row.activities.price,
            latitude: row.activities.latitude,
            longitude: row.activities.longitude,
          }
        : null;

    // If the day already exists, just push the non-null activity
    if (itineraryDay) {
      if (activity) {
        itineraryDay.activities.push(activity);
      }
    } else {
      tripsMap[row.tripId].itinerary.push({
        day: row.itineraryDays,
        activities: activity ? [activity] : [],
      });
    }
  });

  const result = Object.values(tripsMap);

  // Return the object values as an array of trips
  return result;
}

export default reshapeTripData;
