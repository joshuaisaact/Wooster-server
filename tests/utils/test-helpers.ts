import { MockDestination } from '../../src/types/test-types';

export const createMockDestination = (
  overrides?: Partial<MockDestination>,
): MockDestination => ({
  destinationName: 'Paris',
  latitude: '48.8566',
  longitude: '2.3522',
  description:
    'The City of Light, known for its iconic Eiffel Tower and world-class cuisine',
  country: 'France',
  ...overrides,
});
