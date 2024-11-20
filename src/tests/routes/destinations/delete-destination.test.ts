import { mockAuthMiddleware } from '../../../__mocks__/auth-middleware';
jest.mock('../../../src/middleware/auth-middleware', () => mockAuthMiddleware);

import request from 'supertest';
import app from '../../../index';
import supabase from '../../../models/supabase-client';
import * as destinationService from '../../../services/destination-service';
import { mockDestination } from '../../mocks/destination-mocks';
import { mockAuthHeader } from '../../mocks/auth-mocks';
import { createDBNotFoundError } from '../../../types/errors';

// Mock the service
jest.mock('../../../src/services/destination-service');
const mockedDeleteDestination = jest.spyOn(
  destinationService,
  'deleteDestinationById',
);

describe('DELETE /destinations/:destinationId', () => {
  beforeEach(async () => {
    await supabase.rpc('start_transaction');
    jest.clearAllMocks();
  });

  afterEach(async () => {
    await supabase.rpc('rollback_transaction');
  });

  describe('successful deletion', () => {
    it('should delete the destination successfully', async () => {
      const destinationId = 1;
      mockedDeleteDestination.mockResolvedValue([mockDestination]);

      const res = await request(app)
        .delete(`/api/destinations/${destinationId}`)
        .set('Authorization', mockAuthHeader) // Add auth header
        .expect(200);

      expect(res.body).toHaveProperty(
        'message',
        'Destination deleted successfully:',
      );
      expect(mockedDeleteDestination).toHaveBeenCalledWith(destinationId);
    });
  });

  // Update other test cases similarly
  it('should return 404 if the destination is not found', async () => {
    const nonexistentId = 999;
    // Mock the error that the service actually throws
    mockedDeleteDestination.mockRejectedValue(
      createDBNotFoundError(`No destination found with ID ${nonexistentId}`, {
        destinationId: nonexistentId,
      }),
    );

    const res = await request(app)
      .delete(`/api/destinations/${nonexistentId}`)
      .set('Authorization', mockAuthHeader)
      .expect(404);

    expect(res.body).toHaveProperty(
      'error',
      `No destination found with ID ${nonexistentId}`,
    );
  });

  it('should return 404 if the destination is not found', async () => {
    const nonexistentId = 999;
    mockedDeleteDestination.mockRejectedValue(
      createDBNotFoundError(`No destination found with ID ${nonexistentId}`, {
        destinationId: nonexistentId,
      }),
    );

    const res = await request(app)
      .delete(`/api/destinations/${nonexistentId}`)
      .set('Authorization', mockAuthHeader);

    console.log('Response:', {
      status: res.status,
      body: res.body,
    });

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty(
      'error',
      `No destination found with ID ${nonexistentId}`,
    );
  });

  describe('error handling', () => {
    it('should handle database errors gracefully', async () => {
      const destinationId = 1;
      mockedDeleteDestination.mockRejectedValue(new Error('Database error'));

      const res = await request(app)
        .delete(`/api/destinations/${destinationId}`)
        .set('Authorization', mockAuthHeader) // Add auth header
        .expect(500);

      expect(res.body).toHaveProperty('error', 'Internal server error');
      expect(mockedDeleteDestination).toHaveBeenCalledWith(destinationId);
    });

    it('should handle unexpected errors', async () => {
      const destinationId = 1;
      mockedDeleteDestination.mockRejectedValue({ unexpected: 'error' });

      const res = await request(app)
        .delete(`/api/destinations/${destinationId}`)
        .set('Authorization', mockAuthHeader) // Add auth header
        .expect(500);

      expect(res.body).toHaveProperty('error', 'Internal server error');
    });
  });
});
