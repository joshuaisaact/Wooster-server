// tests/helpers/destination-mocks.ts
import { FullMockDestination } from '../../src/types/test-types';

export const mockDestination: FullMockDestination = {
  destinationId: 1,
  destinationName: 'Paris',
  latitude: '48.8566',
  longitude: '2.3522',
  description: 'The City of Light',
  country: 'France',
  bestTimeToVisit: 'Spring',
  averageTemperatureLow: '8',
  averageTemperatureHigh: '25',
  popularActivities: 'Eiffel Tower Visit',
  travelTips: 'Buy museum pass',
  nearbyAttractions: 'Versailles',
  transportationOptions: 'Metro, Bus, RER',
  accessibilityInfo: 'Wheelchair accessible',
  officialLanguage: 'French',
  currency: 'EUR',
  localCuisine: 'French cuisine',
  costLevel: 'High',
  safetyRating: '8',
  culturalSignificance: 'High historical significance',
  userRatings: 'Excellent',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
};
