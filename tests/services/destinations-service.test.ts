import {
  fetchDestinations,
  fetchDestinationDetailsByName,
  fetchDestinationIdByName,
  addDestination,
  deleteDestinationById,
} from '../../src/services/destination-service';
import { db } from '../../src/db';
import { mockDestination } from '../mocks/destination-mocks';

// Need to mock DB so tests don't hit real database
jest.mock('../../src/db');

describe('Destination Service Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Mock data based on actual destination from DB
  const newDestination = {
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

  // Started with basic fetch functionality
  it('fetches destinations list', async () => {
    (db.select as jest.Mock).mockReturnValueOnce({
      from: jest.fn().mockResolvedValue([mockDestination]),
    });

    const result = await fetchDestinations();
    expect(result).toEqual([mockDestination]);
  });

  // Added after getting a DB error in dev
  it('handles fetch errors', async () => {
    (db.select as jest.Mock).mockReturnValueOnce({
      from: jest.fn().mockRejectedValue(new Error('DB error')),
    });

    await expect(fetchDestinations()).rejects.toThrow(
      'Error fetching destinations',
    );
  });

  // Added when implementing destination details page
  it('gets destination details by name', async () => {
    (db.select as jest.Mock).mockReturnValueOnce({
      from: jest.fn().mockReturnValue({
        where: jest.fn().mockResolvedValue([mockDestination]),
      }),
    });

    const result = await fetchDestinationDetailsByName('Paris');
    expect(result).toEqual(mockDestination);
  });

  // Added this after users were hitting 404s
  it('handles delete of non-existent destination', async () => {
    (db.delete as jest.Mock).mockReturnValueOnce({
      where: jest.fn().mockReturnValue({
        returning: jest.fn().mockResolvedValue([]),
      }),
    });

    await expect(deleteDestinationById(999)).rejects.toThrow(
      'Error deleting destination with ID 999: No destination found with ID 999',
    );
  });

  // Basic fetch by ID test
  it('finds destination ID by name', async () => {
    const mockWithId = { destinationId: mockDestination.destinationId };
    (db.select as jest.Mock).mockReturnValueOnce({
      from: jest.fn().mockReturnValue({
        where: jest.fn().mockResolvedValue([mockWithId]),
      }),
    });

    const result = await fetchDestinationIdByName('Paris');
    expect(result).toEqual(mockWithId.destinationId);
  });

  // Added when building create destination feature
  it('adds new destination', async () => {
    (db.insert as jest.Mock).mockReturnValueOnce({
      values: jest.fn().mockReturnValue({
        returning: jest.fn().mockResolvedValue([mockDestination]),
      }),
    });

    const result = await addDestination(newDestination);
    expect(result).toEqual(mockDestination);
  });

  // Added this when the DB insert was failing
  it('handles creation errors', async () => {
    (db.insert as jest.Mock).mockReturnValueOnce({
      values: jest.fn().mockReturnValue({
        returning: jest.fn().mockRejectedValue(new Error('DB error')),
      }),
    });

    await expect(addDestination(newDestination)).rejects.toThrow(
      'Failed to insert',
    );
  });

  // Basic delete functionality
  it('deletes destinations', async () => {
    (db.delete as jest.Mock).mockReturnValueOnce({
      where: jest.fn().mockReturnValue({
        returning: jest.fn().mockResolvedValue([mockDestination]),
      }),
    });

    const result = await deleteDestinationById(1);
    expect(result).toEqual([mockDestination]);
  });
});
