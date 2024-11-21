import { mockLLMDestinations } from '../fixtures/destinations';
import { mockLLMTrips } from '../fixtures/trips';

const mockGenerateContent = jest.fn();

export const mockGeminiClient = {
  getGenerativeModel: jest.fn().mockReturnValue({
    generateContent: mockGenerateContent,
  }),
};

export const setLLMResponse = (
  type: 'success' | 'malformed' | 'timeout' | 'empty',
  dataType: 'destination' | 'trip',
  destinationData:
    | (typeof mockLLMDestinations)[keyof typeof mockLLMDestinations]
    | null = null,
) => {
  if (type === 'success') {
    mockGenerateContent.mockResolvedValue({
      response: {
        text: () =>
          JSON.stringify(
            dataType === 'destination'
              ? destinationData || mockLLMDestinations.tokyo
              : mockLLMTrips.tokyo,
          ),
      },
    });
  } else if (type === 'malformed') {
    mockGenerateContent.mockResolvedValue({
      response: {
        text: () => '{broken json',
      },
    });
  } else if (type === 'timeout') {
    mockGenerateContent.mockRejectedValue(new Error('AbortError'));
  } else if (type === 'empty') {
    mockGenerateContent.mockResolvedValue({
      response: {
        text: () => '',
      },
    });
  }
};
