import request from 'supertest';
import app from '../../../src/index';
import supabase from '../../../src/models/supabase-client';
import * as destinationService from '../../../src/services/destination-service';
import { FullMockDestination } from '../../../src/types/test-types';

// Mock the service
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
      normalizedName: 'toykyo',
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

  describe('successful retrieval', () => {
    it('should return all destinations successfully', async () => {
      mockedFetchDestinations.mockResolvedValue(mockDestinations);

      const res = await request(app).get('/api/destinations').expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body).toHaveLength(2);
      expect(res.body[0]).toHaveProperty('destinationName', 'Paris');
      expect(res.body[1]).toHaveProperty('destinationName', 'Tokyo');
    });

    it('should return an empty array when no destinations exist', async () => {
      mockedFetchDestinations.mockResolvedValue([]);

      const res = await request(app).get('/api/destinations').expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body).toHaveLength(0);
    });
  });

  describe('error handling', () => {
    it('should handle database errors', async () => {
      mockedFetchDestinations.mockRejectedValue(
        new Error('Database connection error'),
      );

      const res = await request(app).get('/api/destinations').expect(500);

      expect(res.body).toHaveProperty('error', 'Something went wrong');
    });

    it('should handle unexpected errors', async () => {
      mockedFetchDestinations.mockRejectedValue({
        notAnError: 'unexpected error type',
      });

      const res = await request(app).get('/api/destinations').expect(500);

      expect(res.body).toHaveProperty('error', 'Something went wrong');
    });
  });

  describe('performance', () => {
    it('should handle large result sets', async () => {
      // Create an array of 100 destinations
      const largeDestinationSet = Array.from({ length: 100 }, (_, i) => ({
        ...mockDestinations[0],
        id: i + 1,
        destinationName: `Destination ${i + 1}`,
      }));

      mockedFetchDestinations.mockResolvedValue(largeDestinationSet);

      const res = await request(app).get('/api/destinations').expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body).toHaveLength(100);
    });
  });

  describe('data integrity', () => {
    it('should return destinations with all expected properties', async () => {
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
        nearbyAttractions: 'Versailles Giverny',
        transportationOptions: 'Metro, Bus, RER',
        accessibilityInfo: 'Most attractions wheelchair accessible',
        officialLanguage: 'French',
        currency: 'EUR',
        localCuisine: 'Croissants Coq au Vin',
        costLevel: 'High',
        safetyRating: '8',
        userRatings: 'good',
        culturalSignificance: 'High historical and artistic significance',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockedFetchDestinations.mockResolvedValue([fullDestination]);

      const res = await request(app).get('/api/destinations').expect(200);

      expect(res.body[0]).toMatchObject(
        expect.objectContaining({
          destinationName: expect.any(String),
          latitude: expect.any(String),
          longitude: expect.any(String),
          description: expect.any(String),
          country: expect.any(String),
        }),
      );
    });
  });
});
