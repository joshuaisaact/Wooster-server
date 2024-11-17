// Mock the DB to avoid actual DB calls in tests
jest.mock('../../src/db');
jest.mock('../../src/utils/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  },
}));

import {
  fetchDestinations,
  fetchDestinationDetailsByName,
  addDestination,
  deleteDestinationById,
} from '../../src/services/destination-service';
import { db } from '../../src/db';
import { mockDestination } from '../mocks/destination-mocks';

describe('Destination Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Basic destination data used in a few tests
  const newDestinationData = {
    destinationId: 1,
    destinationName: 'Paris',
    latitude: '48.8566',
    longitude: '2.3522',
    description: 'The City of Light',
    country: 'France',
    bestTimeToVisit: 'Spring',
    averageTemperatureLow: '8',
    averageTemperatureHigh: '25',
    popularActivities: 'Eiffel Tower Visit',
    travelTips: 'Buy museum pass',
    nearbyAttractions: 'Versailles',
    transportationOptions: 'Metro, Bus, RER',
    accessibilityInfo: 'Wheelchair accessible',
    officialLanguage: 'French',
    currency: 'EUR',
    localCuisine: 'French cuisine',
    costLevel: 'High',
    safetyRating: '8',
    culturalSignificance: 'High historical significance',
    userRatings: 'Excellent',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  // Started with basic fetch test
  it('fetches all destinations', async () => {
    const mockDestinations = [mockDestination];
    (db.select as jest.Mock).mockReturnValueOnce({
      from: jest.fn().mockResolvedValue(mockDestinations),
    });

    const result = await fetchDestinations();
    expect(result).toEqual(mockDestinations);
  });

  // Added error handling test after seeing DB issues
  it('handles fetch errors', async () => {
    const mockFrom = jest.fn().mockRejectedValue(new Error('DB error'));
    (db.select as jest.Mock).mockReturnValue({ from: mockFrom });

    try {
      await fetchDestinations();
      fail('Expected an error to be thrown');
    } catch (error) {
      expect(error).toMatchObject({
        message: 'Error fetching destinations',
        status: 500,
        code: 'DB_QUERY_FAILED',
      });
    }
  });

  // Added when implementing destination detail page
  it('fetches destination details by name', async () => {
    (db.select as jest.Mock).mockReturnValueOnce({
      from: jest.fn().mockReturnValue({
        where: jest.fn().mockResolvedValue([mockDestination]),
      }),
    });

    const result = await fetchDestinationDetailsByName('Paris');
    expect(result).toEqual(mockDestination);
  });

  // Added after finding 404 issues
  it('handles non-existent destination lookups', async () => {
    (db.select as jest.Mock).mockReturnValueOnce({
      from: jest.fn().mockReturnValue({
        where: jest.fn().mockResolvedValue([]),
      }),
    });

    try {
      await fetchDestinationDetailsByName('Unknown');
      fail('Expected an error to be thrown');
    } catch (error) {
      expect(error).toMatchObject({
        message: 'Error fetching destination with name Unknown',
        status: 500,
        code: 'DB_QUERY_FAILED',
      });
    }
  });

  // Basic create test
  it('adds new destinations', async () => {
    (db.insert as jest.Mock).mockReturnValueOnce({
      values: jest.fn().mockReturnValue({
        returning: jest.fn().mockResolvedValue([mockDestination]),
      }),
    });

    const result = await addDestination(newDestinationData);
    expect(result).toEqual(mockDestination);
  });

  // Added after seeing insert fail in dev
  it('handles insert errors', async () => {
    (db.insert as jest.Mock).mockReturnValueOnce({
      values: jest.fn().mockReturnValue({
        returning: jest.fn().mockRejectedValue(new Error('DB error')),
      }),
    });

    try {
      await addDestination(newDestinationData);
      fail('Expected an error to be thrown');
    } catch (error) {
      expect(error).toMatchObject({
        message: 'Failed to insert destination',
        status: 500,
        code: 'DB_QUERY_FAILED',
      });
    }
  });

  // Basic delete test
  it('deletes destinations by id', async () => {
    (db.delete as jest.Mock).mockReturnValueOnce({
      where: jest.fn().mockReturnValue({
        returning: jest.fn().mockResolvedValue([mockDestination]),
      }),
    });

    const result = await deleteDestinationById(1);
    expect(result).toEqual([mockDestination]);
  });

  // Added this when working on error handling
  it('handles delete errors', async () => {
    (db.delete as jest.Mock).mockReturnValueOnce({
      where: jest.fn().mockReturnValue({
        returning: jest.fn().mockRejectedValue(new Error('DB error')),
      }),
    });

    try {
      await deleteDestinationById(1);
      fail('Expected an error to be thrown');
    } catch (error) {
      expect(error).toMatchObject({
        message: 'Error deleting destination with ID 1',
        status: 500,
        code: 'DB_QUERY_FAILED',
      });
    }
  });
});
