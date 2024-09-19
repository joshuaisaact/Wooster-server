export interface Activity {
  name: string;
  description: string;
  location: string;
  price: string;
  image: string;
}

export interface DayItinerary {
  day: number;
  activities: Activity[];
}

export interface Trip {
  id: string;
  destination: string;
  num_days: number;
  date: string;
  itinerary: DayItinerary[];
}
