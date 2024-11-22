import { mockGeminiClient } from '@/tests/mocks/llm';

jest.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: jest.fn().mockImplementation(() => mockGeminiClient),
}));

import { generateTripItinerary } from '@/services/llm/generators/trip';
import { mockLLMTrips } from '@/tests/fixtures/trips';
import { setLLMResponse } from '@/tests/mocks/llm';

describe('Trip Generator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.GEMINI_API_KEY = 'test-key';
  });

  it('successfully generates trip itinerary', async () => {
    setLLMResponse([{ type: 'success', dataType: 'trip', location: 'tokyo' }]);

    const result = await generateTripItinerary(2, 'Tokyo', '20th January', [
      'Cultural',
      'Food & Drink',
    ]);

    expect(result).toEqual(mockLLMTrips.tokyo);
  });

  it('handles malformed JSON response', async () => {
    setLLMResponse([
      { type: 'malformed', dataType: 'trip', location: 'tokyo' },
    ]);

    await expect(
      generateTripItinerary(2, 'Tokyo', '20th January', [
        'Cultural',
        'Food & Drink',
      ]),
    ).rejects.toEqual(
      expect.objectContaining({
        message: 'Invalid JSON response from LLM for trip itinerary',
        status: 422,
        code: 'VALIDATION_ERROR',
        details: expect.objectContaining({
          error: expect.stringContaining('Invalid JSON response:'),
          rawResponse: '{broken json',
        }),
      }),
    );
  });

  it('handles empty responses', async () => {
    setLLMResponse([{ type: 'empty', dataType: 'trip', location: 'tokyo' }]);

    await expect(
      generateTripItinerary(2, 'Tokyo', '20th January', [
        'Cultural',
        'Food & Drink',
      ]),
    ).rejects.toMatchObject({
      message: 'Empty response from LLM',
      code: 'AI_SERVICE_ERROR',
    });
  });
});
