import request from 'supertest';
import app from '../../../src/index';
import supabase from '../../../src/models/supabase-client';
import * as destinationService from '../../../src/services/destination-service';
import {
  DatabaseError,
  FullMockDestination,
} from '../../../src/types/test-types';

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

  const mockDestination: FullMockDestination = {
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

  describe('successful retrieval', () => {
    it('should return destination details when found', async () => {
      mockedFetchDestinationByName.mockResolvedValue(mockDestination);

      const res = await request(app).get('/destination/Paris').expect(200);

      expect(mockedFetchDestinationByName).toHaveBeenCalledWith('Paris');
      expect(res.body).toHaveProperty('destinationName', 'Paris');
      expect(res.body).toHaveProperty('country', 'France');
      expect(res.body.destinationId).toBe(1);
    });

    it('should handle URL-encoded destination names', async () => {
      const encodedDestination = {
        ...mockDestination,
        destinationName: 'New York City',
      };
      mockedFetchDestinationByName.mockResolvedValue(encodedDestination);

      const res = await request(app)
        .get('/destination/New%20York%20City')
        .expect(200);

      expect(res.body).toHaveProperty('destinationName', 'New York City');
      expect(mockedFetchDestinationByName).toHaveBeenCalledWith(
        'New York City',
      );
    });

    it('should handle special characters in destination names', async () => {
      const specialCharDestination = {
        ...mockDestination,
        destinationName: 'São Paulo',
      };
      mockedFetchDestinationByName.mockResolvedValue(specialCharDestination);

      const res = await request(app)
        .get('/destination/S%C3%A3o%20Paulo')
        .expect(200);

      expect(res.body).toHaveProperty('destinationName', 'São Paulo');
      expect(mockedFetchDestinationByName).toHaveBeenCalledWith('São Paulo');
    });
  });

  describe('error handling', () => {
    it('should return 404 when destination is not found', async () => {
      mockedFetchDestinationByName.mockRejectedValue(
        new Error('Destination with name NonExistentCity not found'),
      );

      const res = await request(app)
        .get('/destination/NonExistentCity')
        .expect(404);

      expect(res.body).toHaveProperty('error', 'Destination not found');
    });

    it('should handle database errors', async () => {
      const dbError = new Error('Database connection error') as DatabaseError;
      mockedFetchDestinationByName.mockRejectedValue(dbError);

      const res = await request(app).get('/destination/Paris').expect(500);

      expect(res.body).toHaveProperty('error', 'Something went wrong');
    });

    it('should handle not found errors from service', async () => {
      const notFoundError = new Error('Destination with name Paris not found');
      mockedFetchDestinationByName.mockRejectedValue(notFoundError);

      const res = await request(app).get('/destination/Paris').expect(404);

      expect(res.body).toHaveProperty('error', 'Destination not found');
    });
  });

  describe('data integrity', () => {
    it('should return destinations with all required properties', async () => {
      mockedFetchDestinationByName.mockResolvedValue(mockDestination);

      const res = await request(app).get('/destination/Paris').expect(200);

      expect(res.body).toMatchObject({
        destinationId: expect.any(Number),
        destinationName: expect.any(String),
        latitude: expect.any(String),
        longitude: expect.any(String),
        description: expect.any(String),
        country: expect.any(String),
      });
    });

    it('should handle null values for optional properties', async () => {
      const partialDestination: FullMockDestination = {
        ...mockDestination,
        popularActivities: null,
        travelTips: null,
        nearbyAttractions: null,
      };
      mockedFetchDestinationByName.mockResolvedValue(partialDestination);

      const res = await request(app).get('/destination/Paris').expect(200);

      expect(res.body.popularActivities).toBeNull();
      expect(res.body.travelTips).toBeNull();
      expect(res.body.nearbyAttractions).toBeNull();
    });

    it('should maintain correct data types for all fields', async () => {
      mockedFetchDestinationByName.mockResolvedValue(mockDestination);

      const res = await request(app).get('/destination/Paris').expect(200);

      expect(typeof res.body.destinationId).toBe('number');
      expect(typeof res.body.destinationName).toBe('string');
      expect(typeof res.body.latitude).toBe('string');
      expect(typeof res.body.longitude).toBe('string');
      expect(typeof res.body.averageTemperatureLow).toBe('string');
      expect(typeof res.body.averageTemperatureHigh).toBe('string');
      expect(typeof res.body.safetyRating).toBe('string');
    });
  });

  describe('edge cases', () => {
    it('should handle empty string destination name', async () => {
      const res = await request(app).get('/destination/%20').expect(400);

      expect(res.body).toHaveProperty('error', 'Destination name is required');
    });

    it('should handle very long destination names', async () => {
      const longName = 'A'.repeat(256);
      mockedFetchDestinationByName.mockResolvedValue(null);

      const res = await request(app)
        .get(`/destination/${longName}`)
        .expect(404);

      expect(res.body).toHaveProperty('error', 'Destination not found');
    });
  });
});
