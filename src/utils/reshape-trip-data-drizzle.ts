import { TripDBRow, DBItineraryDay, DBActivity } from '../types/db-types';

interface Trip {
  tripId: string;
  startDate: Date | null;
  status: string;
  numDays: number | null;
  description: string | null;
  title: string | null;
  destination: {
    destinationId?: number | undefined;
    destinationName: string;
    latitude: string;
    longitude: string;
    description: string;
    country: string;
    bestTimeToVisit: string;
    averageTemperatureLow: string;
    averageTemperatureHigh: string;
    popularActivities: string;
    travelTips: string;
    nearbyAttractions: string;
    transportationOptions: string;
    accessibilityInfo: string;
    officialLanguage: string;
    currency: string;
    localCuisine: string;
    costLevel: string;
    safetyRating: string;
    culturalSignificance: string;
    userRatings: string;
  };
  itinerary: DBItineraryDay[];
}

// Reshape the data returned by Drizzle ORM
function reshapeTripData(dbData: TripDBRow[]) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tripsMap: Record<string, Trip> = {};

  dbData.forEach((row: TripDBRow) => {
    // If the trip is not yet in tripsMap, add it
    if (!tripsMap[row.tripId]) {
      tripsMap[row.tripId] = {
        tripId: row.tripId.toString(),
        startDate: row.startDate,
        status: row.status,
        numDays: row.numDays,
        description: row.description === 'NULL' ? null : row.description,
        title: row.title === 'NULL' ? null : row.title,
        destination: {
          destinationId: row.destination?.destinationId,
          destinationName:
            row.destination?.destinationName || 'Unknown Destination',
          latitude: row.destination?.latitude || '',
          longitude: row.destination?.longitude || '',
          description: row.destination?.description || '',
          country: row.destination?.country || '',
          bestTimeToVisit: row.destination?.bestTimeToVisit || '',
          averageTemperatureLow: row.destination?.averageTemperatureLow || '',
          averageTemperatureHigh: row.destination?.averageTemperatureHigh || '',
          popularActivities: row.destination?.popularActivities || '',
          travelTips: row.destination?.travelTips || '',
          nearbyAttractions: row.destination?.nearbyAttractions || '',
          transportationOptions: row.destination?.transportationOptions || '',
          accessibilityInfo: row.destination?.accessibilityInfo || '',
          officialLanguage: row.destination?.officialLanguage || '',
          currency: row.destination?.currency || '',
          localCuisine: row.destination?.localCuisine || '',
          costLevel: row.destination?.costLevel || '',
          safetyRating: row.destination?.safetyRating || '',
          culturalSignificance: row.destination?.culturalSignificance || '',
          userRatings: row.destination?.userRatings || '',
        },
        itinerary: [],
      };
    }

    // Handle itinerary day grouping
    const itineraryDay = tripsMap[row.tripId].itinerary.find(
      (day: DBItineraryDay) => day.day === row.itineraryDays,
    );

    const activity =
      row.activities && row.activities.activityId
        ? {
            activityId: row.activities.activityId,
            activityName: row.activities.activityName,
            description: row.activities.description,
            location: row.activities.location,
            price: row.activities.price,
            duration: row.activities.duration,
            latitude: row.activities.latitude
              ? parseFloat(row.activities.latitude)
              : null,
            longitude: row.activities.longitude
              ? parseFloat(row.activities.longitude)
              : null,
            difficulty: row.activities.difficulty,
            category: row.activities.category,
            bestTime: row.activities.bestTime,
            slotNumber: row.slotNumber,
          }
        : null;

    // If the day exists, add activity and sort by slot number
    if (itineraryDay) {
      if (activity) {
        itineraryDay.activities.push(activity);
      }
    } else {
      // Create new day with activity
      tripsMap[row.tripId].itinerary.push({
        day: row.itineraryDays ?? 1,
        activities: activity ? [activity] : [],
      });
    }
  });

  for (const trip of Object.values(tripsMap)) {
    trip.itinerary.sort(
      (a: DBItineraryDay, b: DBItineraryDay) => a.day - b.day,
    );

    trip.itinerary.forEach((day: DBItineraryDay) => {
      day.activities.sort(
        (a: DBActivity, b: DBActivity) =>
          (a.slotNumber ?? 1) - (b.slotNumber ?? 1),
      );
    });
  }

  return Object.values(tripsMap);
}

export default reshapeTripData;
