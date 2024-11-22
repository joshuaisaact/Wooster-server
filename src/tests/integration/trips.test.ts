import { testDb } from '../setup/test-db';

jest.mock('../../db', () => {
  const originalModule = jest.requireActual('../../db');
  return {
    ...originalModule,
    db: testDb,
  };
});

import { mockGeminiClient, setLLMResponse } from '@/__mocks__/llm';
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
import { eq, sql } from 'drizzle-orm';
import { fetchTripFromDB } from '@/services/trip-service';

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

  describe('Trips API', () => {
    it('can get a single trip by ID', async () => {
      await retry(async () => {
        setLLMResponse([
          { type: 'success', dataType: 'destination', location: 'tokyo' },
          { type: 'success', dataType: 'trip', location: 'tokyo' },
        ]);

        await api.post('/api/trips').set('Authorization', authHeader).send({
          days: 2,
          location: 'Tokyo',
          startDate: '2024-12-25',
        });

        const trip = await fetchTripFromDB(
          '1',
          'e92ad976-973d-406d-92d4-34b6ef182e1a',
        );

        const response = await api
          .get('/api/trips/1')
          .set('Authorization', authHeader)
          .expect(200);

        expect(response.body).toMatchObject({
          message: 'Trip fetched successfully',
          trip,
        });
      });
    });

    it('can get a list of trips', async () => {
      await retry(async () => {
        setLLMResponse([
          { type: 'success', dataType: 'destination', location: 'tokyo' },
          { type: 'success', dataType: 'trip', location: 'tokyo' },
        ]);

        await api.post('/api/trips').set('Authorization', authHeader).send({
          days: 2,
          location: 'Tokyo',
          startDate: '2024-12-25',
        });

        setLLMResponse([
          { type: 'success', dataType: 'destination', location: 'paris' },
          { type: 'success', dataType: 'trip', location: 'paris' },
        ]);

        await api.post('/api/trips').set('Authorization', authHeader).send({
          days: 1,
          location: 'Paris',
          startDate: '2024-12-26',
        });

        const response = await api
          .get('/api/trips')
          .set('Authorization', authHeader)
          .expect(200);

        expect(response.body).toHaveLength(2);
        expect(response.body[0]).toMatchObject({
          tripId: expect.any(String),
          numDays: expect.any(Number),
          startDate: expect.any(String),
          destination: expect.objectContaining({
            destinationName: expect.any(String),
          }),
        });
      });
    });

    it('creates a new trip with a new destination', async () => {
      await retry(async () => {
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

        const tripInDb = await testDb
          .select()
          .from(trips)
          .where(eq(trips.tripId, Number(response.body.trip.tripId)))
          .execute();

        expect(tripInDb[0]).toBeDefined();
        expect(tripInDb[0].numDays).toBe(2);
      });
    });

    it('creates a trip using an existing destination', async () => {
      setLLMResponse([
        { type: 'success', dataType: 'destination', location: 'paris' },
      ]);

      await api
        .post('/api/destinations')
        .set('Authorization', authHeader)
        .send({ destination: 'Paris' });

      setLLMResponse([
        { type: 'success', dataType: 'trip', location: 'paris' },
      ]);

      const response = await api
        .post('/api/trips')
        .set('Authorization', authHeader)
        .send({
          days: 1,
          location: 'Paris',
          startDate: '2024-12-25',
        })
        .expect(201);

      const tripInDb = await testDb
        .select()
        .from(trips)
        .where(eq(trips.tripId, Number(response.body.trip.tripId)))
        .execute();

      expect(tripInDb[0]).toBeDefined();
      expect(tripInDb[0].numDays).toBe(1);

      const destinationResult = await testDb
        .select({
          count: sql<number>`count(*)`.mapWith(Number),
        })
        .from(destinations)
        .execute();

      expect(destinationResult[0].count).toBe(1);
    });
  });
});
