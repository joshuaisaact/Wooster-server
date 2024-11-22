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
import { retry } from '../helpers/retry';

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
    });
  });

  function generateRandomDestination() {
    return Math.random().toString(36).substring(2, 15);
  }

  it('can get a list of saved destinations', async () => {
    await retry(async () => {
      const randomDestination = generateRandomDestination();
      setLLMResponse('success', 'destination');

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

  it('can delete a saved destination', async () => {
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

      setLLMResponse('success', 'destination');
      const res = await api
        .post('/api/destinations')
        .set('Authorization', authHeader)
        .set('Content-Type', 'application/json')
        .send({ destination: destinationName })
        .expect(201);

      const id = res.body.destination.destinationId;

      setLLMResponse('success', 'destination');
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

  it('handles malformed LLM responses', async () => {
    await retry(async () => {
      setLLMResponse('malformed', 'destination');

      const response = await api
        .post('/api/saved-destinations/2')
        .set('Authorization', authHeader)
        .set('Content-Type', 'application/json')
        .send({ destination: 'Tokyo' });

      expect(response.status).toBe(500);
      expect(response.body.error).toContain('Failed to save destination');
    });
  });
});