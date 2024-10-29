export interface Activity {
  activityId: number;
  activityName: string | null;
  description: string | null;
  location: string | null;
  price: string | null;
  latitude: string | null;
  longitude: string | null;
}

export interface DayItinerary {
  day: number;
  activities: Activity[];
}

export interface Trip {
  tripId: string;
  startDate: string;
  numDays: number;
  destinationName: string;
  itinerary: ItineraryDay[];
}

export interface ItineraryDay {
  day_number: number;
  activities: Activity[];
}
