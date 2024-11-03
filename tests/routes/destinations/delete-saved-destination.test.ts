import { mockAuthMiddleware } from '../../mocks/auth-middleware-mock';

// Mock auth middleware
jest.mock('../../../src/middleware/auth-middleware', () => mockAuthMiddleware);

import request from 'supertest';
import app from '../../../src/index';
import supabase from '../../../src/models/supabase-client';
import * as destinationService from '../../../src/services/saved-destination-service';
import { mockAuthHeader } from '../../mocks/auth-mocks';

// Mock the service
jest.mock('../../../src/services/saved-destination-service');

// Type the mocked function
const mockedDeleteSavedDestination = jest.spyOn(
  destinationService,
  'deleteSavedDestination',
);

describe('Saved Destinations Routes', () => {
  beforeEach(async () => {
    await supabase.rpc('start_transaction');
    jest.clearAllMocks();
  });

  afterEach(async () => {
    await supabase.rpc('rollback_transaction');
  });

  describe('DELETE /saved-destinations/:destinationId', () => {
    describe('successful deletion', () => {
      it('should delete a saved destination successfully', async () => {
        const mockDeletedDestination = {
          id: 1,
          userId: 'test-user-id',
          destinationId: 1,
          createdAt: new Date(),
          notes: 'some notes',
          isVisited: true,
        };

        mockedDeleteSavedDestination.mockResolvedValue(mockDeletedDestination);

        const res = await request(app)
          .delete('/api/saved-destinations/1')
          .set('Authorization', mockAuthHeader)
          .expect(200);

        expect(mockedDeleteSavedDestination).toHaveBeenCalledWith(
          'test-user-id',
          1,
        );
        expect(res.body).toEqual({
          message: 'Saved destination deleted successfully',
        });
      });
    });

    describe('validation errors', () => {
      it('should return 400 for invalid destinationId', async () => {
        const res = await request(app)
          .delete('/api/saved-destinations/invalid')
          .set('Authorization', mockAuthHeader)
          .expect(400);

        expect(res.body).toHaveProperty(
          'error',
          'Valid destination ID is required',
        );
      });
    });

    describe('error handling', () => {
      it('should handle unauthorized requests', async () => {
        const res = await request(app)
          .delete('/api/saved-destinations/1')
          .expect(401);

        expect(res.body).toHaveProperty('error');
      });

      it('should handle not found errors', async () => {
        mockedDeleteSavedDestination.mockRejectedValue(
          new Error('No saved destination found'),
        );

        const res = await request(app)
          .delete('/api/saved-destinations/1')
          .set('Authorization', mockAuthHeader)
          .expect(404);

        expect(res.body).toHaveProperty('error', 'Saved destination not found');
      });

      it('should handle service errors', async () => {
        mockedDeleteSavedDestination.mockRejectedValue(
          new Error('Database error'),
        );

        const res = await request(app)
          .delete('/api/saved-destinations/1')
          .set('Authorization', mockAuthHeader)
          .expect(500);

        expect(res.body).toHaveProperty(
          'error',
          'Failed to delete saved destination',
        );
      });
    });
  });
});
