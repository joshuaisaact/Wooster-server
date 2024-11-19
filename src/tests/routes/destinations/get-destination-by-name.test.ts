import request from 'supertest';
import app from '../../../index';
import supabase from '../../../models/supabase-client';
import * as destinationService from '../../../services/destination-service';
import { FullMockDestination } from '../../../types/test-types';

// Mock the service
jest.mock('../../../src/services/destination-service');
const mockedFetchDestinationByName = jest.spyOn(
  destinationService,
  'fetchDestinationDetailsByName',
) as jest.SpyInstance<Promise<FullMockDestination | null>>;

describe('GET /destination/:destinationName', () => {
  beforeEach(async () => {
    await supabase.rpc('start_transaction');
    jest.clearAllMocks();
  });

  afterEach(async () => {
    await supabase.rpc('rollback_transaction');
  });

  // Made this mock based on actual AI response format
  const mockDestination: FullMockDestination = {
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

  // Started with basic happy path test
  it('returns destination details when found', async () => {
    mockedFetchDestinationByName.mockResolvedValue(mockDestination);

    const res = await request(app).get('/api/destination/Paris').expect(200);

    expect(res.body.destinationName).toBe('Paris');
    expect(res.body.country).toBe('France');
  });

  // Added this after finding URL encoding issues
  it('handles spaces in destination names', async () => {
    const nycDestination = {
      ...mockDestination,
      destinationName: 'New York City',
    };
    mockedFetchDestinationByName.mockResolvedValue(nycDestination);

    const res = await request(app)
      .get('/api/destination/New%20York%20City')
      .expect(200);

    expect(res.body.destinationName).toBe('New York City');
  });

  // Basic error handling test
  it('returns 404 when destination not found', async () => {
    mockedFetchDestinationByName.mockResolvedValue(null);

    const res = await request(app)
      .get('/api/destination/NonExistentCity')
      .expect(404);

    expect(res.body.error).toBe('Destination not found');
  });

  // Added after getting DB errors in testing
  it('handles database errors gracefully', async () => {
    mockedFetchDestinationByName.mockRejectedValue(new Error('DB error'));

    const res = await request(app).get('/api/destination/Paris').expect(500);

    expect(res.body.error).toBe('Something went wrong');
  });

  // Added to make sure all fields come through correctly
  it('returns all destination fields with correct types', async () => {
    mockedFetchDestinationByName.mockResolvedValue(mockDestination);

    const res = await request(app).get('/api/destination/Paris').expect(200);

    // Just checking the main fields we care about
    expect(res.body).toMatchObject({
      destinationId: expect.any(Number),
      destinationName: expect.any(String),
      description: expect.any(String),
      country: expect.any(String),
      latitude: expect.any(String),
      longitude: expect.any(String),
    });
  });

  // Added this when I found some fields could be null
  it('handles optional fields being null', async () => {
    const partialDestination = {
      ...mockDestination,
      popularActivities: null,
      travelTips: null,
      nearbyAttractions: null,
    };

    mockedFetchDestinationByName.mockResolvedValue(partialDestination);

    const res = await request(app).get('/api/destination/Paris').expect(200);

    expect(res.body.popularActivities).toBeNull();
    expect(res.body.travelTips).toBeNull();
  });
});
