import { testDb } from '../setup/test-db';

jest.mock('../../db', () => {
  const originalModule = jest.requireActual('../../db');
  return {
    ...originalModule,
    db: testDb,
  };
});

import { mockGeminiClient } from '@/tests/mocks/llm';
import { requireAuth } from '@/__mocks__/auth-middleware';

jest.mock('@/middleware/auth-middleware', () => ({
  requireAuth: requireAuth,
}));

jest.mock('@google/generative-ai', () => {
  return {
    GoogleGenerativeAI: jest.fn().mockImplementation(() => {
      return mockGeminiClient;
    }),
  };
});

import request from 'supertest';
import app from '@/index';
import { setLLMResponse } from '../mocks/llm';
import {
  activities,
  destinations,
  itineraryDays,
  savedDestinations,
  trips,
} from '@/db';
import { retry } from '../helpers/retry';
import { mockLLMDestinations } from '../fixtures/destinations';
import { normalizeDestinationName } from '@/services/destination-service';
import { resetSequences } from '../utils/reset-sequence';

const api = request(app);

describe('Saved destination API', () => {
  const authHeader = 'Bearer test-token';

  beforeAll(async () => {
    process.env.GEMINI_API_KEY = 'test-key';
  });

  beforeEach(async () => {
    await retry(async () => {
      await testDb.delete(savedDestinations);
      await testDb.delete(activities);
      await testDb.delete(itineraryDays);
      await testDb.delete(trips);
      await testDb.delete(destinations);

      await resetSequences();
    });
  });

  function generateRandomDestination() {
    return Math.random().toString(36).substring(2, 15);
  }

  it('can get a list of saved destinations', async () => {
    await retry(async () => {
      const randomDestination = generateRandomDestination();
      setLLMResponse([
        { type: 'success', dataType: 'destination', location: 'tokyo' },
      ]);

      await api
        .post('/api/destinations')
        .set('Authorization', authHeader)
        .set('Content-Type', 'application/json')
        .send({ destination: randomDestination })
        .expect(201);

      await api
        .get('/api/saved-destinations')
        .set('Authorization', authHeader)
        .expect(200);
    });
  });

  it('can save an existing destination to the saved destinations list', async () => {
    await retry(async () => {
      const mockDestination = mockLLMDestinations.kerry;

      await testDb.select().from(destinations);

      // Insert the destination
      await testDb.insert(destinations).values({
        ...mockDestination,
        normalizedName: normalizeDestinationName(
          mockDestination.destinationName,
        ),
      });

      await testDb.select().from(destinations);

      // Make the API call
      const response = await api
        .post('/api/saved-destinations/1')
        .set('Authorization', authHeader)
        .set('Content-Type', 'application/json')
        .send({ destination: 'Kerry' })
        .expect(201);

      await testDb.select().from(destinations);

      expect(response.body.message).toBe('Destination saved successfully');
    });
  });

  it('can delete a saved destination', async () => {
    await retry(async () => {
      const destinationName = 'Tokyo';

      setLLMResponse([
        { type: 'success', dataType: 'destination', location: 'tokyo' },
      ]);

      const createResponse = await api
        .post('/api/destinations')
        .set('Authorization', authHeader)
        .set('Content-Type', 'application/json')
        .send({ destination: destinationName })
        .expect(201);

      const id = createResponse.body.destination.destinationId;

      await api
        .delete(`/api/saved-destinations/${id}`)
        .set('Authorization', authHeader)
        .expect(200);

      const getResponse = await api
        .get('/api/saved-destinations')
        .set('Authorization', authHeader);

      expect(getResponse.body).toEqual({
        message: 'Fetched saved destinations successfully',
        savedDestinations: [],
      });
    });
  });

  it('gives a conflict error if destination is already saved', async () => {
    await retry(async () => {
      const destinationName = 'Tokyo';

      setLLMResponse([
        { type: 'success', dataType: 'destination', location: 'tokyo' },
      ]);
      const res = await api
        .post('/api/destinations')
        .set('Authorization', authHeader)
        .set('Content-Type', 'application/json')
        .send({ destination: destinationName })
        .expect(201);

      const id = res.body.destination.destinationId;

      setLLMResponse([
        { type: 'success', dataType: 'destination', location: 'tokyo' },
      ]);
      const response = await api
        .post(`/api/saved-destinations/${id}`)
        .set('Authorization', authHeader)
        .set('Content-Type', 'application/json')
        .send({ destination: destinationName });

      expect(response.status).toBe(409);
      expect(response.body).toEqual({
        error: 'Destination already saved!',
        savedDestination: expect.any(Object),
      });
    });
  });

  it('fails with 401 if no auth token', async () => {
    await retry(async () => {
      await api
        .post('/api/saved-destinations/1')
        .set('Content-Type', 'application/json')
        .send({ destination: 'Tokyo' })
        .expect(401);
    });
  });
});
