import { mockAuthMiddleware } from '../../mocks/auth-middleware-mock';
jest.mock('../../../src/middleware/auth-middleware', () => mockAuthMiddleware);

import request from 'supertest';
import app from '../../../src/index';
import supabase from '../../../src/models/supabase-client';
import * as destinationService from '../../../src/services/saved-destination-service';
import { mockAuthHeader } from '../../mocks/auth-mocks';
import { mockDestination } from '../../mocks/destination-mocks';
import { FullMockDestination } from '../../../src/types/test-types';

// Mock the service
jest.mock('../../../src/services/saved-destination-service');

// Added this type to match what comes back from the DB
type MockSavedDestination = {
  id: number;
  userId: string;
  destinationId: number;
  createdAt: Date;
  notes: string | null;
  isVisited: boolean | null;
  destination: FullMockDestination | null;
};

// Setting up our mocked functions
const mockedAddSavedDestination = jest.spyOn(
  destinationService,
  'addSavedDestination',
);

const mockedFindSavedDestinationByUserAndDest = jest.spyOn(
  destinationService,
  'findSavedDestinationByUserAndDest',
) as jest.SpyInstance<Promise<MockSavedDestination | null>>;

describe('Saved destinations', () => {
  beforeEach(async () => {
    await supabase.rpc('start_transaction');
    jest.clearAllMocks();
  });

  afterEach(async () => {
    await supabase.rpc('rollback_transaction');
  });

  // First test I wrote - happy path with all fields
  it('saves a destination with notes and visited status', async () => {
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
      .post('/api/saved-destinations/1')
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

  // Added this to test minimal required fields
  it('saves a destination with just destinationId', async () => {
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
      .post('/api/saved-destinations/1')
      .set('Authorization', mockAuthHeader)
      .send({ destinationId: 1 })
      .expect(201);

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
