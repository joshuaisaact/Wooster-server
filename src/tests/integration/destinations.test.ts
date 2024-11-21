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

jest.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: jest.fn().mockImplementation(() => mockGeminiClient),
}));

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
import { mockLLMDestinations } from '../fixtures/destinations';
import { normalizeDestinationName } from '@/services/destination-service';
import { retry } from '../helpers/retry';

const api = request(app);

describe('Destination API', () => {
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
    });
  });

  function generateRandomDestination() {
    return Math.random().toString(36).substring(2, 15);
  }

  it('can get a list of destinations', async () => {
    await retry(async () => {
      await api
        .get('/api/destinations')
        .set('Authorization', authHeader)
        .expect(200);
    });
  });

  it('can create a new destination', async () => {
    await retry(async () => {
      const randomDestination = generateRandomDestination();
      setLLMResponse('success', 'destination');

      await api
        .post('/api/destinations')
        .set('Authorization', authHeader)
        .set('Content-Type', 'application/json')
        .send({ destination: randomDestination })
        .expect(201);
    });
  });

  it('gives a conflict error if destination is already saved', async () => {
    await retry(async () => {
      const destinationName = 'Tokyo';

      setLLMResponse('success', 'destination');
      await api
        .post('/api/destinations')
        .set('Authorization', authHeader)
        .set('Content-Type', 'application/json')
        .send({ destination: destinationName })
        .expect(201);

      setLLMResponse('success', 'destination');
      const response = await api
        .post('/api/destinations')
        .set('Authorization', authHeader)
        .set('Content-Type', 'application/json')
        .send({ destination: destinationName });

      expect(response.status).toBe(409);
      expect(response.body.code).toBe('DESTINATION_ALREADY_SAVED');
      expect(response.body.error).toBe('Destination is already saved');
    });
  });

  it('can save an existing destination to the saved destinations list', async () => {
    await retry(async () => {
      const mockDestination = mockLLMDestinations.tokyo;

      await testDb.insert(destinations).values({
        ...mockDestination,
        normalizedName: normalizeDestinationName(
          mockDestination.destinationName,
        ),
      });

      const response = await api
        .post('/api/destinations')
        .set('Authorization', authHeader)
        .set('Content-Type', 'application/json')
        .send({ destination: 'Tokyo' })
        .expect(201);

      expect(response.body.message).toBe('Destination saved successfully');
    });
  });

  it('can delete a destination', async () => {
    await retry(async () => {
      const destinationName = 'Tokyo';

      setLLMResponse('success', 'destination');

      const createResponse = await api
        .post('/api/destinations')
        .set('Authorization', authHeader)
        .set('Content-Type', 'application/json')
        .send({ destination: destinationName })
        .expect(201);

      const id = createResponse.body.destination.destinationId;

      await api
        .delete(`/api/destinations/${id}`)
        .set('Authorization', authHeader)
        .expect(200);

      // Verify it's gone
      const getResponse = await api
        .get('/api/destinations')
        .set('Authorization', authHeader);

      expect(getResponse.body).toEqual([]);
    });
  });

  it('fails with 401 if no auth token', async () => {
    await retry(async () => {
      await api
        .post('/api/destinations')
        .set('Content-Type', 'application/json')
        .send({ destination: 'Tokyo' })
        .expect(401);
    });
  });

  it('handles malformed LLM responses', async () => {
    await retry(async () => {
      setLLMResponse('malformed', 'destination');

      const response = await api
        .post('/api/destinations')
        .set('Authorization', authHeader)
        .set('Content-Type', 'application/json')
        .send({ destination: 'Tokyo' });

      expect(response.status).toBe(500);
      expect(response.body.error).toContain(
        'Failed to generate destination data',
      );
    });
  });
});
