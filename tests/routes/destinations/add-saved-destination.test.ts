import { mockAuthMiddleware } from '../../mocks/auth-middleware-mock';

// Mock auth middleware
jest.mock('../../../src/middleware/auth-middleware', () => mockAuthMiddleware);

import request from 'supertest';
import app from '../../../src/index';
import supabase from '../../../src/models/supabase-client';
import * as destinationService from '../../../src/services/destination-service';
import { mockAuthHeader } from '../../mocks/auth-mocks';
import { mockDestination } from '../../mocks/destination-mocks';
import { FullMockDestination } from '../../../src/types/test-types';

// Mock the service
jest.mock('../../../src/services/destination-service');

type MockSavedDestination = {
  id: number;
  userId: string;
  destinationId: number;
  createdAt: Date;
  notes: string | null;
  isVisited: boolean | null;
  destination: FullMockDestination | null;
};

// Type the mocked functions
const mockedAddSavedDestination = jest.spyOn(
  destinationService,
  'addSavedDestination',
);
const mockedFindSavedDestinationByUserAndDest = jest.spyOn(
  destinationService,
  'findSavedDestinationByUserAndDest',
) as jest.SpyInstance<Promise<MockSavedDestination | null>>;

describe('Saved Destinations Routes', () => {
  beforeEach(async () => {
    await supabase.rpc('start_transaction');
    jest.clearAllMocks();
  });

  afterEach(async () => {
    await supabase.rpc('rollback_transaction');
  });

  describe('POST /saved-destinations', () => {
    describe('successful creation', () => {
      it('should save a destination successfully', async () => {
        const testDate = new Date();
        const mockSavedDestination: MockSavedDestination = {
          id: 1,
          userId: 'test-user-id',
          destinationId: 1,
          createdAt: testDate,
          notes: 'Want to visit',
          isVisited: false,
          destination: mockDestination,
        };

        mockedFindSavedDestinationByUserAndDest.mockResolvedValue(null);
        mockedAddSavedDestination.mockResolvedValue(mockSavedDestination);

        const res = await request(app)
          .post('/api/saved-destinations')
          .set('Authorization', mockAuthHeader)
          .send({
            destinationId: 1,
            notes: 'Want to visit',
            isVisited: false,
          })
          .expect(201);

        expect(mockedAddSavedDestination).toHaveBeenCalledWith(
          'test-user-id',
          1,
          'Want to visit',
          false,
        );

        // Log the actual response for debugging
        console.log('Actual response:', JSON.stringify(res.body, null, 2));

        const expectedResponse = {
          message: 'Destination saved successfully',
          savedDestination: {
            ...mockSavedDestination,
            createdAt: testDate.toISOString(),
            destination: {
              ...mockDestination,
              createdAt: mockDestination.createdAt.toISOString(),
              updatedAt: mockDestination.updatedAt.toISOString(),
            },
          },
        };

        expect(res.body).toEqual(expectedResponse);
      });

      it('should handle saving without optional fields', async () => {
        const testDate = new Date();
        const mockSavedDestination: MockSavedDestination = {
          id: 1,
          userId: 'test-user-id',
          destinationId: 1,
          createdAt: testDate,
          notes: null,
          isVisited: false,
          destination: mockDestination,
        };

        mockedFindSavedDestinationByUserAndDest.mockResolvedValue(null);
        mockedAddSavedDestination.mockResolvedValue(mockSavedDestination);

        const res = await request(app)
          .post('/api/saved-destinations')
          .set('Authorization', mockAuthHeader)
          .send({ destinationId: 1 })
          .expect(201);

        expect(mockedAddSavedDestination).toHaveBeenCalledWith(
          'test-user-id',
          1,
          undefined,
          false,
        );

        const expectedResponse = {
          message: 'Destination saved successfully',
          savedDestination: {
            ...mockSavedDestination,
            createdAt: testDate.toISOString(),
            destination: {
              ...mockDestination,
              createdAt: mockDestination.createdAt.toISOString(),
              updatedAt: mockDestination.updatedAt.toISOString(),
            },
          },
        };

        expect(res.body).toEqual(expectedResponse);
      });
    });

    describe('validation errors', () => {
      it('should return 400 when destinationId is missing', async () => {
        const res = await request(app)
          .post('/api/saved-destinations')
          .set('Authorization', mockAuthHeader)
          .send({})
          .expect(400);

        expect(res.body).toHaveProperty(
          'error',
          'Valid destination ID is required',
        );
      });

      // it('should return 409 when destination is already saved', async () => {
      //   const existingSavedDestination = {
      //     id: 1,
      //     userId: 'test-user-id',
      //     destinationId: 1,
      //   };

      //   mockedFindSavedDestinationByUserAndDest.mockResolvedValue(
      //     existingSavedDestination,
      //   );

      //   const res = await request(app)
      //     .post('/api/saved-destinations')
      //     .set('Authorization', mockAuthHeader)
      //     .send({ destinationId: 1 })
      //     .expect(409);

      //   expect(res.body).toHaveProperty('error', 'Destination already saved');
      // });
    });

    describe('error handling', () => {
      it('should handle unauthorized requests', async () => {
        const res = await request(app)
          .post('/api/saved-destinations')
          .send({ destinationId: 1 })
          .expect(401);

        expect(res.body).toHaveProperty('error');
      });

      it('should handle service errors', async () => {
        mockedFindSavedDestinationByUserAndDest.mockResolvedValue(null);
        mockedAddSavedDestination.mockRejectedValue(
          new Error('Database error'),
        );

        const res = await request(app)
          .post('/api/saved-destinations')
          .set('Authorization', mockAuthHeader)
          .send({ destinationId: 1 })
          .expect(500);

        expect(res.body).toHaveProperty('error', 'Failed to save destination');
      });
    });
  });
});
