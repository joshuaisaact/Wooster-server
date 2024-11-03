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

// Type the mocked function
const mockedFetchSavedDestinations = jest.spyOn(
  destinationService,
  'fetchSavedDestinations',
);

describe('Saved Destinations Routes', () => {
  beforeEach(async () => {
    await supabase.rpc('start_transaction');
    jest.clearAllMocks();
  });

  afterEach(async () => {
    await supabase.rpc('rollback_transaction');
  });

  describe('GET /saved-destinations', () => {
    describe('successful retrieval', () => {
      it('should fetch saved destinations successfully', async () => {
        const testDate = new Date();
        const mockSavedDestinations: MockSavedDestination[] = [
          {
            id: 1,
            userId: 'test-user-id',
            destinationId: 1,
            createdAt: testDate,
            notes: 'Want to visit',
            isVisited: false,
            destination: mockDestination,
          },
        ];

        mockedFetchSavedDestinations.mockResolvedValue(mockSavedDestinations);

        const res = await request(app)
          .get('/api/saved-destinations')
          .set('Authorization', mockAuthHeader)
          .expect(200);

        expect(mockedFetchSavedDestinations).toHaveBeenCalledWith(
          'test-user-id',
        );

        const expectedResponse = [
          {
            ...mockSavedDestinations[0],
            createdAt: testDate.toISOString(),
            destination: {
              ...mockDestination,
              createdAt: mockDestination.createdAt.toISOString(),
              updatedAt: mockDestination.updatedAt.toISOString(),
            },
          },
        ];

        expect(res.body).toEqual(expectedResponse);
      });

      it('should return empty array when user has no saved destinations', async () => {
        mockedFetchSavedDestinations.mockResolvedValue([]);

        const res = await request(app)
          .get('/api/saved-destinations')
          .set('Authorization', mockAuthHeader)
          .expect(200);

        expect(mockedFetchSavedDestinations).toHaveBeenCalledWith(
          'test-user-id',
        );
        expect(res.body).toEqual([]);
      });
    });

    describe('error handling', () => {
      it('should handle unauthorized requests', async () => {
        // Simply don't send the Authorization header
        const res = await request(app)
          .get('/api/saved-destinations')
          .expect(401);

        expect(res.body).toHaveProperty('error');
      });

      it('should handle service errors', async () => {
        mockedFetchSavedDestinations.mockRejectedValue(
          new Error('Database error'),
        );

        const res = await request(app)
          .get('/api/saved-destinations')
          .set('Authorization', mockAuthHeader)
          .expect(500);

        expect(res.body).toHaveProperty('error', 'Something went wrong');
      });
    });
  });
});
