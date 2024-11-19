import { mockLLMDestinations } from '../fixtures/destinations';

const mockGenerateContent = jest.fn();

export const mockGeminiClient = {
  getGenerativeModel: jest.fn().mockReturnValue({
    generateContent: mockGenerateContent,
  }),
};

export const setLLMResponse = (type: 'success' | 'malformed') => {
  console.log('Setting LLM response to:', type);
  if (type === 'success') {
    mockGenerateContent.mockResolvedValue({
      response: {
        text: () => JSON.stringify(mockLLMDestinations.tokyo),
      },
    });
  } else {
    mockGenerateContent.mockResolvedValue({
      response: {
        text: () => '{broken json',
      },
    });
  }
};

// Log when the mock is set up
console.log('Setting up Google AI mock');
jest.mock('@google/generative-ai', () => {
  console.log('Mock constructor called');
  return {
    GoogleGenerativeAI: jest.fn(() => {
      console.log('Creating mock client');
      return mockGeminiClient;
    }),
  };
});
