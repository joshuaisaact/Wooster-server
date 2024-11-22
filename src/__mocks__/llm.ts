import { mockLLMDestinations } from '../tests/fixtures/destinations';
import { mockLLMTrips } from '../tests/fixtures/trips';

const mockGenerateContent = jest.fn();

export const mockGeminiClient = {
  getGenerativeModel: jest.fn().mockReturnValue({
    generateContent: mockGenerateContent,
  }),
};

export const setLLMResponse = (
  responses: Array<{
    type: 'success' | 'malformed' | 'timeout' | 'empty';
    dataType: 'destination' | 'trip';
    location: keyof typeof mockLLMTrips;
  }>,
) => {
  responses.forEach(({ type, dataType, location }) => {
    const mockData = {
      destination: mockLLMDestinations[location],
      trip: mockLLMTrips[location],
    };

    const responseTypes = {
      success: {
        response: {
          text: () => JSON.stringify(mockData[dataType]),
        },
      },
      malformed: {
        response: {
          text: () => '{broken json',
        },
      },
      empty: {
        response: {
          text: () => '',
        },
      },
    };

    if (type === 'timeout') {
      mockGenerateContent.mockImplementationOnce(() =>
        Promise.reject(new Error('AbortError')),
      );
    } else {
      mockGenerateContent.mockImplementationOnce(() =>
        Promise.resolve(responseTypes[type]),
      );
    }
  });
};
