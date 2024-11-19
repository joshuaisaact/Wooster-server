import { mockGeminiClient } from '@/tests/mocks/llm';

// Mock before importing the service
jest.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: jest.fn().mockImplementation(() => mockGeminiClient),
}));

// Now import your service
import { generateDestinationData } from '@/services/llm/generators/destination';
import { setLLMResponse } from '@/tests/mocks/llm';
import { mockLLMDestinations } from '@/tests/fixtures/destinations';

describe('Destination Generator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.GEMINI_API_KEY = 'test-key';
  });

  it('successfully generates destination data', async () => {
    setLLMResponse('success');

    const result = await generateDestinationData('Tokyo');
    expect(JSON.parse(result)).toEqual(mockLLMDestinations.tokyo);
  });

  it('handles malformed JSON response', async () => {
    setLLMResponse('malformed');

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
