export type Difficulty = 'Easy' | 'Moderate' | 'Challenging' | string | null;

export type Category =
  | 'Adventure'
  | 'Cultural'
  | 'Nature'
  | 'Food & Drink'
  | 'Shopping'
  | 'Entertainment'
  | string
  | null;

export type BestTime =
  | 'Early Morning'
  | 'Morning'
  | 'Afternoon'
  | 'Evening'
  | 'Night'
  | 'Any Time'
  | string
  | null;

export interface Activity {
  activityId: number;
  activityName: string | null;
  description: string | null;
  location: string | null;
  price: string | null;
  latitude: string | null;
  longitude: string | null;
  duration: string | null;
  difficulty: Difficulty;
  category: Category;
  bestTime: BestTime;
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
  dayNumber: number;
  activities: Activity[];
}
