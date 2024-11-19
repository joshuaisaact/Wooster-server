import { mockAuthMiddleware } from '../../mocks/auth-middleware-mock';
jest.mock('../../../src/middleware/auth-middleware', () => mockAuthMiddleware);

import request from 'supertest';
import app from '../../../index';
import supabase from '../../../models/supabase-client';
import { generateDestinationData } from '../../../services/google-ai-service';
import * as destinationService from '../../../services/destination-service';
import * as savedDestinationService from '../../../services/saved-destination-service';
import {
  FullMockDestination,
  MockSavedDestination,
} from '../../../types/test-types';
import { mockAuthHeader } from '../../mocks/auth-mocks';
import { NewDestination } from '../../../types/destination-type';
import { ServiceError } from '../../../utils/error-handlers';

// Mock our services
jest.mock('../../../src/services/google-ai-service');
jest.mock('../../../src/services/destination-service');
jest.mock('../../../src/services/saved-destination-service');

// Setup mock functions - these need to match the real function signatures
const mockedGenerateDestinationData =
  generateDestinationData as jest.MockedFunction<
    typeof generateDestinationData
  >;
const mockedAddDestination = jest.spyOn(destinationService, 'addDestination');
const mockedFindDestinationByName = jest.spyOn(
  destinationService,
  'findDestinationByName',
);
const mockedAddSavedDestination = jest.spyOn(
  savedDestinationService,
  'addSavedDestination',
);
const mockedFindSavedDestinationByUserAndDest = jest.spyOn(
  savedDestinationService,
  'findSavedDestinationByUserAndDest',
);
const mockedGenerateNewDestination = jest.spyOn(
  destinationService,
  'generateNewDestination',
);

describe('Destination Routes', () => {
  const testDate = new Date();

  // Reset before each test
  beforeEach(async () => {
    await supabase.rpc('start_transaction');
    jest.clearAllMocks();

    // Default to no existing destinations
    mockedFindDestinationByName.mockResolvedValue(
      null as unknown as FullMockDestination,
    );
    mockedFindSavedDestinationByUserAndDest.mockResolvedValue(
      null as unknown as MockSavedDestination,
    );
    mockedGenerateNewDestination.mockResolvedValue(
      null as unknown as NewDestination,
    );
  });

  afterEach(async () => {
    await supabase.rpc('rollback_transaction');
  });

  // Test data based on a real AI response I got while testing
  const mockDestinationData: FullMockDestination = {
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
    userRatings: null,
    createdAt: testDate,
    updatedAt: testDate,
  };

  describe('POST /destinations', () => {
    // Main success path - this was the first test I wrote
    it('creates a new destination', async () => {
      const createdDestination = { ...mockDestinationData };
      const savedDestination = {
        id: 1,
        userId: 'test-user-id',
        destinationId: 1,
        createdAt: testDate,
        notes: null,
        isVisited: false,
      };

      mockedFindDestinationByName.mockResolvedValue(
        null as unknown as FullMockDestination,
      );
      mockedGenerateDestinationData.mockResolvedValue(
        JSON.stringify(mockDestinationData),
      );
      mockedAddDestination.mockResolvedValue(createdDestination);
      mockedAddSavedDestination.mockResolvedValue(savedDestination);

      const res = await request(app)
        .post('/api/destinations')
        .set('Authorization', mockAuthHeader)
        .send({ destination: 'Paris' })
        .expect(201);

      const expectedResponse = {
        ...createdDestination,
        createdAt: testDate.toISOString(),
        updatedAt: testDate.toISOString(),
        saved: {
          ...savedDestination,
          createdAt: testDate.toISOString(),
        },
      };

      expect(res.body.destination).toEqual(expectedResponse);
    });

    // Basic validation
    it('returns 400 when destination is missing', async () => {
      const res = await request(app)
        .post('/api/destinations')
        .set('Authorization', mockAuthHeader)
        .send({})
        .expect(400);

      expect(res.body).toHaveProperty('error', 'Destination is required');
    });

    // Added this after the AI service failed in testing
    it('handles AI service errors gracefully', async () => {
      mockedFindDestinationByName.mockResolvedValue(
        null as unknown as FullMockDestination,
      );
      mockedGenerateNewDestination.mockRejectedValue(
        new ServiceError('Failed to generate destination data', 500),
      );

      const res = await request(app)
        .post('/api/destinations')
        .set('Authorization', mockAuthHeader)
        .send({ destination: 'Paris' })
        .expect(500);

      expect(res.body).toHaveProperty(
        'error',
        'An unexpected error occurred. Please try again later.',
      );
      expect(mockedAddDestination).not.toHaveBeenCalled();
    });

    // Added this after finding duplicate saves
    it('handles already saved destinations', async () => {
      const existingDestination = { ...mockDestinationData };
      const existingSaved = {
        id: 1,
        userId: 'test-user-id',
        destinationId: 1,
        createdAt: testDate,
        notes: null,
        isVisited: false,
      };

      mockedFindDestinationByName.mockResolvedValue(existingDestination);
      mockedFindSavedDestinationByUserAndDest.mockResolvedValue(existingSaved);

      const res = await request(app)
        .post('/api/destinations')
        .set('Authorization', mockAuthHeader)
        .send({ destination: 'Paris' })
        .expect(409);

      expect(res.body).toHaveProperty('error', 'Destination is already saved');
    });
  });
});
