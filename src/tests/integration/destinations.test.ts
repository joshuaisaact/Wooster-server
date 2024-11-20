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
import { db } from '@/db';

const api = request(app);

describe('Destination API', () => {
  const authHeader = 'Bearer test-token';

  beforeEach(() => {
    process.env.GEMINI_API_KEY = 'test-key';
  });

  function generateRandomDestination() {
    return Math.random().toString(36).substring(2, 15); // Random string
  }

  it('can get a list of destinations', async () => {
    const response = await api
      .get('/api/destinations')
      .set('Authorization', authHeader)
      .expect(200);

    console.log('Response:', {
      status: response.status,
      body: response.body,
      error: response.body.error, // Log the error if any
      stack: response.body.stack, // Log the stack trace if available
    });
  });

  it.only('can create a new destination', async () => {
    const randomDestination = generateRandomDestination();

    setLLMResponse('success', 'destination');

    const response = await api
      .post('/api/destinations')
      .set('Authorization', authHeader)
      .set('Content-Type', 'application/json')
      .send({ destination: randomDestination });

    console.log('Response:', {
      status: response.status,
      body: response.body,
      error: response.body.error,
      stack: response.body.stack,
    });

    expect(response.status).toBe(201);
  });

  it('gives an error if the destination already exists and is already saved', async () => {
    setLLMResponse('success', 'destination');

    const response = await api
      .post('/api/destinations')
      .set('Authorization', authHeader)
      .set('Content-Type', 'application/json')
      .send({ destination: 'Tokyo' });

    console.log('Response:', {
      status: response.status,
      body: response.body,
      error: response.body.error, // Log the error if any
      stack: response.body.stack, // Log the stack trace if available
    });

    expect(response.status).toBe(201);
    expect(db.insert).toHaveBeenCalledWith(
      expect.objectContaining({
        destination: 'Tokyo',
      }),
    );
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

    expect(response.status).toBe(422);
    expect(response.body).toMatchObject({
      error: expect.stringContaining('Invalid JSON response'),
    });
  });
});
