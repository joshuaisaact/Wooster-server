import { testDb } from '../setup/test-db';

jest.mock('../../db', () => {
  const originalModule = jest.requireActual('../../db');
  return {
    ...originalModule,
    db: testDb,
  };
});

import { mockGeminiClient, setLLMResponse } from '@/tests/mocks/llm';
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
import { retry } from '../helpers/retry';
import {
  activities,
  destinations,
  itineraryDays,
  savedDestinations,
  trips,
} from '@/db';
import { resetSequences } from '../utils/reset-sequence';
import { eq } from 'drizzle-orm';

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

  // function generateRandomTrip() {
  //   return Math.random().toString(36).substring(2, 15);
  // }

  describe('POST /api/trips', () => {
    it('creates a new trip with generated itinerary', async () => {
      setLLMResponse([
        { type: 'success', dataType: 'destination', location: 'tokyo' },
        { type: 'success', dataType: 'trip', location: 'tokyo' },
      ]);

      const newTripData = {
        days: 2,
        location: 'Tokyo',
        startDate: '2024-12-25',
        selectedCategories: ['Cultural', 'Food & Drink'],
      };

      const response = await api
        .post('/api/trips')
        .set('Authorization', authHeader)
        .send(newTripData)
        .expect(201);

      expect(response.body).toMatchObject({
        message: 'Trip created successfully',
        trip: {
          tripId: expect.any(String),
          destination: {
            destinationId: expect.any(Number),
            destinationName: 'Tokyo',
          },
          numDays: 2,
          startDate: '2024-12-25',
        },
      });

      // Verify the database entries
      const tripInDb = await testDb
        .select()
        .from(trips)
        .where(eq(trips.tripId, Number(response.body.trip.tripId)))
        .execute();

      expect(tripInDb[0]).toBeDefined();
      expect(tripInDb[0].numDays).toBe(2);
    });
  });
});
