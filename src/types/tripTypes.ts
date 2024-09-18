export interface Activity {
  name: string;
  description: string;
  location: string;
  price: string;
}

export interface DayItinerary {
  day: number;
  activities: Activity[];
}

export interface Trip {
  id: number;
  destination: string;
  num_days: number;
  itinerary: DayItinerary[];
}
