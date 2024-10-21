export interface Activity {
  activity_name: string;
  description: string;
  location: string;
  price: string;
  latitude: number;
  longitude: number;
}

export interface DayItinerary {
  day: number;
  activities: Activity[];
}

export interface Trip {
  trip_id: number;
  destination_id: number;
  start_date: string;
  num_days: number;
  itinerary_days: ItineraryDay[];
  destinations: {
    destination_id: string;
    destination_name: string;
    latitude: number;
    longitude: number;
    description: string;
    country: string;
  };
}

export interface ItineraryDay {
  day_number: number;
  activities: Activity;
}
