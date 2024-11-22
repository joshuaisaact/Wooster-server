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
import { mockLLMDestinations } from '../fixtures/destinations';
import { normalizeDestinationName } from '@/services/destination-service';
import { retry } from '../helpers/retry';
import { resetSequences } from '../utils/reset-sequence';

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

    await resetSequences();
  });

  function generateRandomDestination() {
    return Math.random().toString(36).substring(2, 15);
  }

  it('can get a list of destinations', async () => {
    await retry(async () => {
      const mockDestinations = [
        mockLLMDestinations.tokyo,
        mockLLMDestinations.kerry,
      ];

      await Promise.all(
        mockDestinations.map((dest) =>
          testDb.insert(destinations).values({
            ...dest,
            normalizedName: normalizeDestinationName(dest.destinationName),
          }),
        ),
      );

      const response = await api
        .get('/api/destinations')
        .set('Authorization', authHeader)
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBe(2);

      expect(response.body[0]).toEqual(
        expect.objectContaining({
          destinationId: expect.any(Number),
          destinationName: expect.any(String),
          normalizedName: expect.any(String),
        }),
      );
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

  it('can search for destinations', async () => {
    await retry(async () => {
      // Create a couple of destinations
      setLLMResponse('success', 'destination');
      await api
        .post('/api/destinations')
        .set('Authorization', authHeader)
        .set('Content-Type', 'application/json')
        .send({ destination: 'Tokyo' })
        .expect(201);

      setLLMResponse('success', 'destination', mockLLMDestinations.paris);
      await api
        .post('/api/destinations')
        .set('Authorization', authHeader)
        .set('Content-Type', 'application/json')
        .send({ destination: 'Paris' })
        .expect(201);

      // Test partial name search
      const partialResponse = await api
        .get('/api/destinations/search?search=pa')
        .expect(200);

      expect(partialResponse.body.destinations.length).toBe(1);
      expect(partialResponse.body.destinations[0].destinationName).toBe(
        'Paris',
      );

      // Test country filter
      const franceResponse = await api
        .get('/api/destinations/search?country=France')
        .expect(200);

      expect(franceResponse.body.destinations.length).toBe(1);
      expect(franceResponse.body.destinations[0].country).toBe('France');

      // Test combined search
      const combinedResponse = await api
        .get('/api/destinations/search?search=to&country=Japan')
        .expect(200);

      expect(combinedResponse.body.destinations.length).toBe(1);
      expect(combinedResponse.body.destinations[0].destinationName).toBe(
        'Tokyo',
      );
      expect(combinedResponse.body.destinations[0].country).toBe('Japan');
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

      expect(response.status).toBe(422);
      expect(response.body.error).toContain(
        'Invalid JSON response from LLM for destination data',
      );
    });
  });
});
