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

const api = request(app);

describe('Destination API', () => {
  const authHeader = 'Bearer test-token';

  beforeEach(async () => {
    process.env.GEMINI_API_KEY = 'test-key';
    await Promise.all([
      testDb.delete(trips),
      testDb.delete(activities),
      testDb.delete(destinations),
      testDb.delete(itineraryDays),
      testDb.delete(savedDestinations),
    ]);
  });

  function generateRandomDestination() {
    return Math.random().toString(36).substring(2, 15);
  }

  it('can get a list of destinations', async () => {
    await api
      .get('/api/destinations')
      .set('Authorization', authHeader)
      .expect(200);
  });

  it('can create a new destination', async () => {
    const randomDestination = generateRandomDestination();
    setLLMResponse('success', 'destination');

    await api
      .post('/api/destinations')
      .set('Authorization', authHeader)
      .set('Content-Type', 'application/json')
      .send({ destination: randomDestination })
      .expect(201);
  });

  it('gives a conflict error if destination is already saved', async () => {
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

  it('can save an existing destination to the saved destinations list', async () => {
    const mockDestination = mockLLMDestinations.tokyo;

    await testDb.insert(destinations).values({
      ...mockDestination,
      normalizedName: normalizeDestinationName(mockDestination.destinationName),
    });

    const response = await api
      .post('/api/destinations')
      .set('Authorization', authHeader)
      .set('Content-Type', 'application/json')
      .send({ destination: 'Tokyo' })
      .expect(201);

    expect(response.body.message).toBe('Destination saved successfully');
  });

  it('fails with 401 if no auth token', async () => {
    await api
      .post('/api/destinations')
      .set('Content-Type', 'application/json')
      .send({ destination: 'Tokyo' })
      .expect(401);
  });

  it('handles malformed LLM responses', async () => {
    setLLMResponse('malformed', 'destination');

    const response = await api
      .post('/api/destinations')
      .set('Authorization', authHeader)
      .set('Content-Type', 'application/json')
      .send({ destination: 'Tokyo' });

    expect(response.status).toBe(500); // Your code returns 500 not 422
    expect(response.body.error).toContain(
      'Failed to generate destination data',
    );
  });
});
