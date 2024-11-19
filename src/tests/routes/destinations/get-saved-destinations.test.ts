import { mockAuthMiddleware } from '../../mocks/auth-middleware-mock';
jest.mock('../../../src/middleware/auth-middleware', () => mockAuthMiddleware);

import request from 'supertest';
import app from '../../../index';
import supabase from '../../../models/supabase-client';
import * as destinationService from '../../../services/saved-destination-service';
import { mockAuthHeader } from '../../mocks/auth-mocks';
import { mockDestination } from '../../mocks/destination-mocks';
import { FullMockDestination } from '../../../types/test-types';

// Mock the service to avoid DB calls
jest.mock('../../../src/services/saved-destination-service');

type MockSavedDestination = {
  id: number;
  userId: string;
  destinationId: number;
  createdAt: Date;
  notes: string | null;
  isVisited: boolean | null;
  destination: FullMockDestination | null;
};

const mockedFetchSavedDestinations = jest.spyOn(
  destinationService,
  'fetchSavedDestinations',
);

describe('GET /saved-destinations', () => {
  beforeEach(async () => {
    await supabase.rpc('start_transaction');
    jest.clearAllMocks();
  });

  afterEach(async () => {
    await supabase.rpc('rollback_transaction');
  });

  // First test - happy path
  it('gets user saved destinations', async () => {
    const testDate = new Date();
    const mockSaved: MockSavedDestination[] = [
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

    mockedFetchSavedDestinations.mockResolvedValue(mockSaved);

    const res = await request(app)
      .get('/api/saved-destinations')
      .set('Authorization', mockAuthHeader)
      .expect(200);

    // Make sure service was called with right user
    expect(mockedFetchSavedDestinations).toHaveBeenCalledWith('test-user-id');

    // Check response format
    expect(res.body.savedDestinations[0]).toMatchObject({
      id: 1,
      notes: 'Want to visit',
      isVisited: false,
      destination: expect.objectContaining({
        destinationName: mockDestination.destinationName,
      }),
    });
  });

  // Added this to handle empty state
  it('returns empty array for new users', async () => {
    mockedFetchSavedDestinations.mockResolvedValue([]);

    const res = await request(app)
      .get('/api/saved-destinations')
      .set('Authorization', mockAuthHeader)
      .expect(200);

    expect(res.body).toEqual({
      message: 'Fetched saved destinations successfully',
      savedDestinations: [],
    });
  });

  // Basic auth check
  it('requires authentication', async () => {
    const res = await request(app).get('/api/saved-destinations').expect(401);

    expect(res.body.error).toBeTruthy();
  });

  // Added after seeing DB errors in testing
  it('handles service errors', async () => {
    mockedFetchSavedDestinations.mockRejectedValue(new Error('DB error'));

    const res = await request(app)
      .get('/api/saved-destinations')
      .set('Authorization', mockAuthHeader)
      .expect(500);

    expect(res.body.error).toBe(
      'Failed to fetch saved destinations. Please try again later.',
    );
  });
});
