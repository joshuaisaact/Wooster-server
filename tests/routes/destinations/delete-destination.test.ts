import request from 'supertest';
import app from '../../../src/index';
import supabase from '../../../src/models/supabase-client';
import * as destinationService from '../../../src/services/destination-service';
import { mockDestination } from '../../helpers/destination-mocks';

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
        .delete(`/destinations/${destinationId}`)
        .expect(200);

      expect(res.body).toHaveProperty(
        'message',
        'Destination deleted successfully',
      );
      expect(mockedDeleteDestination).toHaveBeenCalledWith(destinationId);
    });
  });

  describe('input validation', () => {
    it('should return 400 for an invalid destination ID', async () => {
      const invalidId = 'invalid-id';

      const res = await request(app)
        .delete(`/destinations/${invalidId}`)
        .expect(400);

      expect(res.body).toHaveProperty('error', 'Invalid destination ID');
      expect(mockedDeleteDestination).not.toHaveBeenCalled();
    });
  });

  describe('not found handling', () => {
    it('should return 404 if the destination is not found', async () => {
      const nonexistentId = 999;
      mockedDeleteDestination.mockResolvedValue([]); // Simulate destination not found

      const res = await request(app)
        .delete(`/destinations/${nonexistentId}`)
        .expect(404);

      expect(res.body).toHaveProperty('error', 'Destination not found');
    });
  });

  describe('error handling', () => {
    it('should handle database errors gracefully', async () => {
      const destinationId = 1;
      mockedDeleteDestination.mockRejectedValue(new Error('Database error'));

      const res = await request(app)
        .delete(`/destinations/${destinationId}`)
        .expect(500);

      expect(res.body).toHaveProperty('error', 'Something went wrong');
      expect(mockedDeleteDestination).toHaveBeenCalledWith(destinationId);
    });

    it('should handle unexpected errors', async () => {
      const destinationId = 1;
      mockedDeleteDestination.mockRejectedValue({ unexpected: 'error' });

      const res = await request(app)
        .delete(`/destinations/${destinationId}`)
        .expect(500);

      expect(res.body).toHaveProperty('error', 'Something went wrong');
    });
  });
});
