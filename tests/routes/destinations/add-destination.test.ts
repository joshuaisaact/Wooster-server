import { mockAuthMiddleware } from '../../mocks/auth-middleware-mock';

// Mock auth middleware
jest.mock('../../../src/middleware/auth-middleware', () => mockAuthMiddleware);

import request from 'supertest';
import app from '../../../src/index';
import supabase from '../../../src/models/supabase-client';
import { generateDestinationData } from '../../../src/services/google-ai-service';
import * as destinationService from '../../../src/services/destination-service';
import * as savedDestinationService from '../../../src/services/saved-destination-service';
import {
  FullMockDestination,
  MockSavedDestination,
} from '../../../src/types/test-types';
import { mockAuthHeader } from '../../mocks/auth-mocks';
import { NewDestination } from '../../../src/types/destination-type';
import { ServiceError } from '../../../src/utils/error-handlers';

// Mock services
jest.mock('../../../src/services/google-ai-service');
jest.mock('../../../src/services/destination-service');
jest.mock('../../../src/services/saved-destination-service');

// Mock the functions from their respective services
const mockedGenerateDestinationData =
  generateDestinationData as jest.MockedFunction<
    typeof generateDestinationData
  >;
const mockedAddDestination = jest.spyOn(destinationService, 'addDestination');
const mockedFindDestinationByName = jest.spyOn(
  destinationService,
  'findDestinationByName',
);

// Saved destination service mocks
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

  beforeEach(async () => {
    await supabase.rpc('start_transaction');
    jest.clearAllMocks();

    // Set up default mocks
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
    describe('successful creation', () => {
      it('should create a new destination successfully', async () => {
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
    });

    describe('validation errors', () => {
      it('should return 400 when destination is missing', async () => {
        const res = await request(app)
          .post('/api/destinations')
          .set('Authorization', mockAuthHeader)
          .send({})
          .expect(400);
        expect(res.body).toHaveProperty('error', 'Destination is required');
      });

      it('should handle empty string destination', async () => {
        const res = await request(app)
          .post('/api/destinations')
          .set('Authorization', mockAuthHeader)
          .send({ destination: '' })
          .expect(400);

        expect(res.body).toHaveProperty('error', 'Destination is required');
      });
    });

    describe('AI service errors', () => {
      it('should handle AI service errors', async () => {
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
          'Failed to generate destination data',
        );
        expect(mockedAddDestination).not.toHaveBeenCalled();
      });

      it('should handle invalid AI response format', async () => {
        mockedFindDestinationByName.mockResolvedValue(
          null as unknown as FullMockDestination,
        );
        mockedGenerateNewDestination.mockRejectedValue(
          new ServiceError('Invalid destination data format', 500),
        );

        const res = await request(app)
          .post('/api/destinations')
          .set('Authorization', mockAuthHeader)
          .send({ destination: 'Paris' })
          .expect(500);

        expect(res.body).toHaveProperty(
          'error',
          'Invalid destination data format',
        );
        expect(mockedAddDestination).not.toHaveBeenCalled();
      });

      it('should handle undefined response from AI service', async () => {
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
          'Failed to generate destination data',
        );
        expect(mockedAddDestination).not.toHaveBeenCalled();
      });

      it('should handle null response from AI service', async () => {
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
          'Failed to generate destination data',
        );
        expect(mockedAddDestination).not.toHaveBeenCalled();
      });
    });

    describe('existing destination', () => {
      it('should handle existing destination', async () => {
        const existingDestination = { ...mockDestinationData };
        const savedDestination = {
          id: 1,
          userId: 'test-user-id',
          destinationId: 1,
          createdAt: testDate,
          notes: null,
          isVisited: false,
        };

        mockedFindDestinationByName.mockResolvedValue(existingDestination);
        mockedAddSavedDestination.mockResolvedValue(savedDestination);

        const res = await request(app)
          .post('/api/destinations')
          .set('Authorization', mockAuthHeader)
          .send({ destination: 'Paris' })
          .expect(200);

        const expectedResponse = {
          ...existingDestination,
          createdAt: testDate.toISOString(),
          updatedAt: testDate.toISOString(),
          saved: {
            ...savedDestination,
            createdAt: testDate.toISOString(),
          },
        };

        expect(res.body.destination).toEqual(expectedResponse);
      });

      it('should handle already saved destination', async () => {
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
        mockedFindSavedDestinationByUserAndDest.mockResolvedValue(
          existingSaved,
        );

        const res = await request(app)
          .post('/api/destinations')
          .set('Authorization', mockAuthHeader)
          .send({ destination: 'Paris' })
          .expect(409);

        expect(res.body).toHaveProperty('error', 'Destination already saved');
      });
    });
  });
});
