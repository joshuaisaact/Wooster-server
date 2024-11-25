import { Destination } from './destination-type';
import { BestTime, Category, Difficulty } from './trip-types';

// The shape of each row returned by the Drizzle query
export interface DBActivity {
  activityId: number;
  activityName: string | null; // Allow null
  description: string | null; // Allow null
  location: string | null; // Allow null
  price: string | null; // Allow null
  latitude: number | null;
  longitude: number | null;
  duration: string | null;
  difficulty: Difficulty;
  category: Category;
  bestTime: BestTime;
}

export interface DBDestination {
  destinationId: number;
  destinationName: string;
  normalizedName: string;
  latitude: string;
  longitude: string;
  description: string;
  country: string;
}

export interface TripDBRow {
  tripId: number;
  destinationId: number | null; // Allow null
  startDate: Date | null; // Allow null
  numDays: number | null; // Allow null
  itineraryDays: number | null; // Allow null
  title: string | null;
  description: string | null;
  activities: {
    activityId: number | null;
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
  } | null;
  destination: Destination | null;
}

export interface DBItineraryDay {
  day: number;
  activities: DBActivity[];
}
