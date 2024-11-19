import { destinations } from '../../fixtures/destinations';
import request from 'supertest';
import app from '../../..';
import * as destinationService from '../../services/destination-service';
import { mockAuthHeader } from '../../mocks/auth-mocks';
import { mockAuthMiddleware } from '../../mocks/auth-middleware-mock';

jest.mock('../../middleware/auth-middleware', () => mockAuthMiddleware);
jest.mock('../../services/destination-service');

describe('GET /destinations', () => {
  const mockedFetchDestinations = jest.spyOn(
    destinationService,
    'fetchDestinations',
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // KEEP: Tests core happy path with auth
  it('returns destinations for authenticated user', async () => {
    const mockData = [destinations.basic.paris];
    mockedFetchDestinations.mockResolvedValue(mockData);

    const res = await request(app)
      .get('/api/destinations')
      .set('Authorization', mockAuthHeader)
      .expect(200);

    expect(res.body[0].destinationName).toBe('Paris');
  });

  // KEEP: Critical auth failure case
  it('returns 401 without auth token', async () => {
    await request(app).get('/api/destinations').expect(401);
  });

  // KEEP: Critical error case
  it('handles database errors', async () => {
    mockedFetchDestinations.mockRejectedValue(new Error('DB connection error'));

    const res = await request(app)
      .get('/api/destinations')
      .set('Authorization', mockAuthHeader)
      .expect(500);

    expect(res.body.error).toBe('Something went wrong');
  });
});
