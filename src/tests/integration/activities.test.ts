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

const api = request(app);

describe('Activities API', () => {
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

  it('can reorder activities within a day', async () => {
    // First create a trip with activities
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
      })
      .expect(201);

    const tripId = createResponse.body.trip.tripId;
    const dayNumber = 1;

    // Get the current activities to know their IDs
    const tripResponse = await api
      .get(`/api/trips/${tripId}`)
      .set('Authorization', authHeader)
      .expect(200);

    const currentActivities = tripResponse.body.trip.itinerary[0].activities;

    // Initially: Museum = slot 1, Senso-ji = slot 2
    // Swap their positions
    const reorderResponse = await api
      .put(`/api/trips/${tripId}/days/${dayNumber}/reorder`)
      .set('Authorization', authHeader)
      .send({
        updates: [
          { activityId: currentActivities[0].activityId, slotNumber: 2 }, // Move Museum to slot 2
          { activityId: currentActivities[1].activityId, slotNumber: 1 }, // Move Senso-ji to slot 1
        ],
      })
      .expect(200);

    expect(reorderResponse.body).toMatchObject({
      message: 'Activities reordered successfully',
      activities: expect.arrayContaining([
        expect.objectContaining({
          activityId: expect.any(Number),
          activityName: expect.any(String),
          slotNumber: expect.any(Number),
        }),
      ]),
    });

    // Verify the new order persisted
    const verifyResponse = await api
      .get(`/api/trips/${tripId}`)
      .set('Authorization', authHeader)
      .expect(200);

    const updatedActivities = verifyResponse.body.trip.itinerary[0].activities;

    // First activity should now be Senso-ji (originally second)
    expect(updatedActivities[0].activityName).toContain('Senso-ji');
    // Second activity should now be Museum (originally first)
    expect(updatedActivities[1].activityName).toContain('Museum');

    // Verify slot numbers
    expect(updatedActivities[0].slotNumber).toBe(1);
    expect(updatedActivities[1].slotNumber).toBe(2);
  });

  it('returns 400 for invalid reordering request', async () => {
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
      })
      .expect(201);

    const tripId = createResponse.body.trip.tripId;
    const dayNumber = 1;

    // Test duplicate slot numbers
    await api
      .put(`/api/trips/${tripId}/days/${dayNumber}/reorder`)
      .set('Authorization', authHeader)
      .send({
        updates: [
          { activityId: 1, slotNumber: 1 },
          { activityId: 2, slotNumber: 1 }, // Duplicate slot
        ],
      })
      .expect(400);

    // Test invalid slot numbers
    await api
      .put(`/api/trips/${tripId}/days/${dayNumber}/reorder`)
      .set('Authorization', authHeader)
      .send({
        updates: [
          { activityId: 1, slotNumber: 0 }, // Invalid slot
          { activityId: 2, slotNumber: 4 }, // Invalid slot
        ],
      })
      .expect(400);
  });
});
