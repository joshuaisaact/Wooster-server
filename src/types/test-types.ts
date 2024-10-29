// Basic destination type for creation
export interface CreateMockDestination {
  destinationName: string;
  latitude: string;
  longitude: string;
  description: string;
  country: string;
}

// Full destination type including all possible fields
export interface FullMockDestination {
  destinationId: number;
  destinationName: string;
  latitude: string | null;
  longitude: string | null;
  description: string | null;
  country: string | null;
  bestTimeToVisit: string | null;
  averageTemperatureLow: string | null;
  averageTemperatureHigh: string | null;
  popularActivities: string | null;
  travelTips: string | null;
  nearbyAttractions: string | null;
  transportationOptions: string | null;
  accessibilityInfo: string | null;
  officialLanguage: string | null;
  currency: string | null;
  localCuisine: string | null;
  costLevel: string | null;
  safetyRating: string | null;
  culturalSignificance: string | null;
  userRatings: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface DatabaseError extends Error {
  code?: string;
}

export interface UnknownErrorType {
  notAnError: string;
}
