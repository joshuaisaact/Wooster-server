export interface NewDestination {
  destinationName: string;
  latitude: string | null;
  longitude: string | null;
  description: string | null;
  country?: string | null;
  popularActivities: string | null;
  travelTips: string | null;
  nearbyAttractions: string | null;
  transportationOptions: string | null;
  bestTimeToVisit: string | null;
  averageTemperatureLow: string | null;
  averageTemperatureHigh: string | null;
  accessibilityInfo: string | null;
  officialLanguage: string | null;
  currency: string | null;
  localCuisine: string | null;
  costLevel: string | null;
  safetyRating: string | null;
  culturalSignificance: string | null;
  userRatings: string | null;
}

export interface Destination extends NewDestination {
  destinationId: number;
  createdAt: Date;
}

export type SavedDestination = {
  userId: string;
  destinationId: number;
  notes?: string;
  isVisited?: boolean;
};

export interface SavedDestinationData {
  id: number;
  userId: string;
  destinationId: number;
  notes?: string;
  isVisited: boolean;
  createdAt: Date;
}
