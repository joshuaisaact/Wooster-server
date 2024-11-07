import { mockAuthMiddleware } from '../../mocks/auth-middleware-mock';
jest.mock('../../../src/middleware/auth-middleware', () => mockAuthMiddleware);

import request from 'supertest';
import app from '../../../src/index';
import supabase from '../../../src/models/supabase-client';
import * as destinationService from '../../../src/services/destination-service';
import { FullMockDestination } from '../../../src/types/test-types';
import { mockAuthHeader } from '../../mocks/auth-mocks';

// Mock destination service
jest.mock('../../../src/services/destination-service');
const mockedFetchDestinations = jest.spyOn(
  destinationService,
  'fetchDestinations',
);

describe('GET /destinations', () => {
  beforeEach(async () => {
    await supabase.rpc('start_transaction');
    jest.clearAllMocks();
  });

  afterEach(async () => {
    await supabase.rpc('rollback_transaction');
  });

  // Made these mock destinations to match what's actually in my DB
  const mockDestinations: FullMockDestination[] = [
    {
      destinationId: 1,
      destinationName: 'Paris',
      normalizedName: 'paris',
      latitude: '48.8566',
      longitude: '2.3522',
      description: 'The City of Light, known for its iconic Eiffel Tower',
      country: 'France',
      bestTimeToVisit: null,
      averageTemperatureLow: null,
      averageTemperatureHigh: null,
      popularActivities: null,
      travelTips: null,
      nearbyAttractions: null,
      transportationOptions: null,
      accessibilityInfo: null,
      officialLanguage: null,
      currency: null,
      localCuisine: null,
      costLevel: null,
      safetyRating: null,
      culturalSignificance: null,
      userRatings: null,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    {
      destinationId: 2,
      destinationName: 'Tokyo',
      normalizedName: 'tokyo',
      latitude: '35.6762',
      longitude: '139.6503',
      description: 'A city where tradition meets modernity',
      country: 'Japan',
      bestTimeToVisit: null,
      averageTemperatureLow: null,
      averageTemperatureHigh: null,
      popularActivities: null,
      travelTips: null,
      nearbyAttractions: null,
      transportationOptions: null,
      accessibilityInfo: null,
      officialLanguage: null,
      currency: null,
      localCuisine: null,
      costLevel: null,
      safetyRating: null,
      culturalSignificance: null,
      userRatings: null,
      createdAt: new Date('2024-01-02'),
      updatedAt: new Date('2024-01-02'),
    },
  ];

  // First wrote this to test the basic GET functionality
  it('returns destinations successfully', async () => {
    mockedFetchDestinations.mockResolvedValue(mockDestinations);

    const res = await request(app)
      .get('/api/destinations')
      .set('Authorization', mockAuthHeader)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(2);
    expect(res.body[0].destinationName).toBe('Paris');
    expect(res.body[1].destinationName).toBe('Tokyo');
  });

  // Added this after thinking about empty DB case
  it('handles no destinations in DB', async () => {
    mockedFetchDestinations.mockResolvedValue([]);

    const res = await request(app)
      .get('/api/destinations')
      .set('Authorization', mockAuthHeader)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(0);
  });

  // Added this after getting DB errors in testing
  it('handles database errors', async () => {
    mockedFetchDestinations.mockRejectedValue(new Error('DB connection error'));

    const res = await request(app)
      .get('/api/destinations')
      .set('Authorization', mockAuthHeader)
      .expect(500);

    expect(res.body.error).toBe('Something went wrong');
  });

  // Made this test to ensure all destination fields come through correctly
  it('returns complete destination data', async () => {
    const fullDestination: FullMockDestination = {
      destinationId: 1,
      destinationName: 'Paris',
      normalizedName: 'paris',
      latitude: '48.8566',
      longitude: '2.3522',
      description: 'The City of Light',
      country: 'France',
      bestTimeToVisit: 'Spring',
      averageTemperatureLow: '8',
      averageTemperatureHigh: '25',
      popularActivities: 'Eiffel Tower Visit, Louvre Museum',
      travelTips: 'Buy museum pass, Learn basic French',
      nearbyAttractions: 'Versailles, Giverny',
      transportationOptions: 'Metro, Bus, RER',
      accessibilityInfo: 'Most attractions wheelchair accessible',
      officialLanguage: 'French',
      currency: 'EUR',
      localCuisine: 'Croissants, Coq au Vin',
      costLevel: 'High',
      safetyRating: '8',
      userRatings: 'good',
      culturalSignificance: 'High historical and artistic significance',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockedFetchDestinations.mockResolvedValue([fullDestination]);

    const res = await request(app)
      .get('/api/destinations')
      .set('Authorization', mockAuthHeader)
      .expect(200);

    // Check the key fields we care about
    expect(res.body[0]).toMatchObject({
      destinationName: expect.any(String),
      latitude: expect.any(String),
      longitude: expect.any(String),
      description: expect.any(String),
      country: expect.any(String),
    });
  });
});
