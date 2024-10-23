export interface Activity {
  activityName: string;
  description: string;
  location: string;
  price: string;
  latitude: string;
  longitude: string;
}

export interface DayItinerary {
  day: number;
  activities: Activity[];
}

export interface Trip {
  tripId: number;
  destinationId: number;
  startDate: string;
  numDays: number;
  itineraryDays: ItineraryDay[];
  destinations: {
    destinationId: string;
    destinationName: string;
    latitude: string;
    longitude: string;
    description: string;
    country: string;
  };
}

export interface ItineraryDay {
  day_number: number;
  activities: Activity;
}
