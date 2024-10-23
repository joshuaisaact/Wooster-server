// Reshape the data returned by Drizzle ORM
function reshapeTripData(dbData: any) {
  const tripsMap: any = {};

  dbData.forEach((row: any) => {
    // If the trip is not yet in tripsMap, add it
    if (!tripsMap[row.tripId]) {
      tripsMap[row.tripId] = {
        tripId: row.tripId.toString(),
        startDate: row.startDate,
        numDays: row.numDays,
        destinationName: row.destination.destinationName,
        itinerary: [],
      };
    }

    // Handle itinerary day grouping
    const itineraryDay = tripsMap[row.tripId].itinerary.find(
      (day: any) => day.day === row.itineraryDays,
    );

    // Check if activities are non-null before pushing them into the array
    const activity =
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
      // If the day does not exist, create a new day with the first non-null activity
      tripsMap[row.tripId].itinerary.push({
        day: row.itineraryDays,
        activities: activity ? [activity] : [],
      });
    }
  });

  // Return the object values as an array of trips
  return Object.values(tripsMap);
}

export default reshapeTripData;
