import { Destination } from './destination-type';
import { BestTime, Category, Difficulty } from './trip-types';

export interface DBActivity {
  activityId: number;
  activityName: string | null;
  description: string | null;
  location: string | null;
  price: string | null;
  latitude: number | null;
  longitude: number | null;
  duration: string | null;
  difficulty: Difficulty;
  category: Category;
  bestTime: BestTime;
  slotNumber: number | null;
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
  destinationId: number | null;
  startDate: Date | null;
  numDays: number | null;
  itineraryDays: number | null;
  slotNumber: number | null;
  status: string;
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

export interface TripTableRow {
  tripId: number;
  startDate: Date | null;
  numDays: number | null;
  title: string | null;
  description: string | null;
  status: TripStatus;
}

export type TripStatus = 'PLANNING' | 'BOOKED' | 'COMPLETED';
