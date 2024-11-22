import { mockGeminiClient } from '@/tests/mocks/llm';

jest.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: jest.fn().mockImplementation(() => mockGeminiClient),
}));

import { generateDestinationData } from '@/services/llm/generators/destination';
import { setLLMResponse } from '@/tests/mocks/llm';
import { mockLLMDestinations } from '@/tests/fixtures/destinations';

describe('Destination Generator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.GEMINI_API_KEY = 'test-key';
  });

  it('successfully generates destination data', async () => {
    setLLMResponse([
      { type: 'success', dataType: 'destination', location: 'tokyo' },
    ]);
    const result = await generateDestinationData('Tokyo');
    expect(result).toEqual(mockLLMDestinations.tokyo);
  });

  it('handles empty responses', async () => {
    setLLMResponse([
      { type: 'empty', dataType: 'destination', location: 'tokyo' },
    ]);
    await expect(generateDestinationData('Tokyo')).rejects.toMatchObject({
      message: 'Empty response from LLM',
      code: 'AI_SERVICE_ERROR',
    });
  });

  it('handles malformed JSON response', async () => {
    setLLMResponse([
      { type: 'malformed', dataType: 'destination', location: 'tokyo' },
    ]);
    await expect(generateDestinationData('Tokyo')).rejects.toEqual(
      expect.objectContaining({
        message: 'Invalid JSON response from LLM for destination data',
        status: 422,
        code: 'VALIDATION_ERROR',
        details: expect.objectContaining({
          error: expect.stringContaining('Invalid JSON response:'),
          rawResponse: '{broken json',
        }),
      }),
    );
  });
});
