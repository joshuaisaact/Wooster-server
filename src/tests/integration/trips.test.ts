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

import { activities, destinations, itineraryDays, trips } from '@/db';
import { resetSequences } from '../utils/reset-sequence';
import { eq, sql } from 'drizzle-orm';
// import { fetchTripFromDB } from '@/services/trip-service';

const api = request(app);

describe('Trips API', () => {
  const authHeader = 'Bearer test-token';

  beforeAll(async () => {
    process.env.GEMINI_API_KEY = 'test-key';
  });

  beforeEach(async () => {
    await testDb.delete(itineraryDays).execute();
    await testDb.delete(activities).execute();
    await testDb.delete(trips).execute();
    await testDb.delete(destinations).execute();
    await resetSequences();
  });

  it('can get a single trip by ID', async () => {
    setLLMResponse([
      { type: 'success', dataType: 'destination', location: 'tokyo' },
      { type: 'success', dataType: 'trip', location: 'tokyo' },
    ]);

    const createResponse = await api
      .post('/api/trips')
      .set('Authorization', authHeader)
      .send({
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

    const tripId = createResponse.body.trip.tripId;

    const response = await api
      .get(`/api/trips/${tripId}`)
      .set('Authorization', authHeader)
      .expect(200);

    expect(response.body).toMatchObject({
      message: 'Trip fetched successfully',
      trip: {
        tripId: expect.any(String),
        startDate: expect.any(String),
        numDays: expect.any(Number),
        destination: expect.any(Object), // Less strict
        itinerary: expect.arrayContaining([
          expect.objectContaining({
            day: expect.any(Number),
            activities: expect.any(Array), // Less strict
          }),
        ]),
      },
    });
  });

  it('can get a list of trips', async () => {
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

    expect(response.body.trips).toHaveLength(2);
    expect(response.body.trips[0]).toMatchObject({
      tripId: expect.any(String),
      numDays: expect.any(Number),
      startDate: expect.any(String),
      destination: expect.objectContaining({
        destinationName: expect.any(String),
      }),
    });
  });

  it('creates a new trip with a new destination', async () => {
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

    // Add a verification GET to make sure it really worked
    const tripId = response.body.trip.tripId;
    const verifyResponse = await api
      .get(`/api/trips/${tripId}`)
      .set('Authorization', authHeader)
      .expect(200);

    expect(verifyResponse.body.trip).toBeDefined();
  });

  it('can update a trip', async () => {
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

    const tripId = response.body.trip.tripId;

    const updatedTrip = {
      startDate: '2024-12-26',
      title: 'My trip',
      description: 'What a trip',
      status: 'BOOKED',
    };

    const newTrip = await api
      .put(`/api/trips/${tripId}`)
      .set('Authorization', authHeader)
      .send(updatedTrip)
      .expect(201);

    expect(newTrip.body.message).toBe('Trip updated successfully');
    expect(newTrip.body.trip).toHaveProperty('title', 'My trip');
    expect(newTrip.body.trip).toHaveProperty('description', 'What a trip');
    expect(newTrip.body.trip).toHaveProperty('status', 'BOOKED');
    expect(newTrip.body.trip).toHaveProperty(
      'startDate',
      '2024-12-26T00:00:00.000Z',
    );
  });

  it('creates a trip using an existing destination', async () => {
    setLLMResponse([
      { type: 'success', dataType: 'destination', location: 'paris' },
    ]);

    await api
      .post('/api/destinations')
      .set('Authorization', authHeader)
      .send({ destination: 'Paris' });

    setLLMResponse([{ type: 'success', dataType: 'trip', location: 'paris' }]);

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

  it('can share a trip', async () => {
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

    const tripId = response.body.trip.tripId;

    const sharedTrip = await api
      .post(`/api/trips/${tripId}/share`)
      .set('Authorization', authHeader)
      .expect(201);

    expect(sharedTrip.body.message).toBe('Share link created successfully');

    const shareCode = sharedTrip.body.shareCode;

    const unprotectedTrip = await api
      .get(`/api/shared/${shareCode}`)
      .expect(200);

    expect(unprotectedTrip.body).toMatchObject({
      message: 'Shared trip fetched successfully',
      trip: {
        tripId: expect.any(String),
        startDate: expect.any(String),
        numDays: expect.any(Number),
        destination: expect.any(Object),
        itinerary: expect.arrayContaining([
          expect.objectContaining({
            day: expect.any(Number),
            activities: expect.any(Array),
          }),
        ]),
      },
    });
  });
});
