// tests/services/destination-service.test.ts

import {
  fetchDestinationsFromDB,
  fetchDestinationDetailsByName,
  fetchDestinationIdByName,
  addDestination,
  deleteDestinationById,
} from '../../src/services/destination-service';
import { db } from '../../src/db';
import { mockDestination } from '../helpers/destination-mocks';

jest.mock('../../src/db');

describe('Destination Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchDestinationsFromDB', () => {
    it('should fetch all destinations successfully', async () => {
      const mockDestinations = [mockDestination];

      (db.select as jest.Mock).mockReturnValueOnce({
        from: jest.fn().mockResolvedValue(mockDestinations),
      });

      const result = await fetchDestinationsFromDB();
      expect(result).toEqual(mockDestinations);
      expect(db.select).toHaveBeenCalled();
    });

    it('should throw an error if fetching fails', async () => {
      (db.select as jest.Mock).mockReturnValueOnce({
        from: jest.fn().mockRejectedValue(new Error('Database error')),
      });

      await expect(fetchDestinationsFromDB()).rejects.toThrow(
        'Error fetching destinations: Database error',
      );
    });
  });

  describe('fetchDestinationDetailsByName', () => {
    it('should fetch destination details by name', async () => {
      const mockDestinationWithName = { ...mockDestination };
      (db.select as jest.Mock).mockReturnValueOnce({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockResolvedValue([mockDestinationWithName]),
        }),
      });

      const result = await fetchDestinationDetailsByName('Paris');
      expect(result).toEqual(mockDestinationWithName);
    });

    it('should throw an error if destination not found', async () => {
      (db.select as jest.Mock).mockReturnValueOnce({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockResolvedValue([]),
        }),
      });

      await expect(fetchDestinationDetailsByName('Unknown')).rejects.toThrow(
        'Destination with name Unknown not found',
      );
    });

    it('should throw an error for unexpected database issues', async () => {
      (db.select as jest.Mock).mockReturnValueOnce({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockRejectedValue(new Error('Unexpected error')),
        }),
      });

      await expect(fetchDestinationDetailsByName('Paris')).rejects.toThrow(
        'Error fetching destination with name Paris: Unexpected error',
      );
    });

    it('should throw an error if fetching fails', async () => {
      (db.select as jest.Mock).mockReturnValueOnce({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockRejectedValue(new Error('Database error')),
        }),
      });

      await expect(fetchDestinationDetailsByName('Paris')).rejects.toThrow(
        'Error fetching destination with name Paris: Database error',
      );
    });
  });

  describe('fetchDestinationIdByName', () => {
    it('should return destination ID by name', async () => {
      const mockDestinationWithId = {
        destinationId: mockDestination.destinationId,
      }; // Just need ID here
      (db.select as jest.Mock).mockReturnValueOnce({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockResolvedValue([mockDestinationWithId]),
        }),
      });

      const result = await fetchDestinationIdByName('Paris');
      expect(result).toEqual(mockDestinationWithId.destinationId);
    });

    it('should throw an error if destination not found', async () => {
      (db.select as jest.Mock).mockReturnValueOnce({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockResolvedValue([]),
        }),
      });

      await expect(fetchDestinationIdByName('Unknown')).rejects.toThrow(
        'Destination with name Unknown not found',
      );
    });

    it('should throw an error if fetching fails', async () => {
      (db.select as jest.Mock).mockReturnValueOnce({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockRejectedValue(new Error('Database error')),
        }),
      });

      await expect(fetchDestinationIdByName('Paris')).rejects.toThrow(
        'Error fetching destination with name Paris: Database error',
      );
    });
  });

  describe('addDestination', () => {
    it('should add a new destination', async () => {
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

      (db.insert as jest.Mock).mockReturnValueOnce({
        values: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([mockDestination]), // Use complete mock
        }),
      });

      const result = await addDestination(newDestinationData);
      expect(result).toEqual(mockDestination);
    });

    it('should throw an error if adding fails', async () => {
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

      (db.insert as jest.Mock).mockReturnValueOnce({
        values: jest.fn().mockReturnValue({
          returning: jest.fn().mockRejectedValue(new Error('Database error')),
        }),
      });

      await expect(addDestination(newDestinationData)).rejects.toThrow(
        'Failed to insert destination: Database error',
      );
    });
  });

  describe('deleteDestinationById', () => {
    it('should delete a destination by ID', async () => {
      (db.delete as jest.Mock).mockReturnValueOnce({
        where: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([mockDestination]),
        }),
      });

      const result = await deleteDestinationById(1);
      expect(result).toEqual([mockDestination]);
    });

    it('should throw an error if no destination found to delete', async () => {
      (db.delete as jest.Mock).mockReturnValueOnce({
        where: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([]),
        }),
      });

      await expect(deleteDestinationById(999)).rejects.toThrow(
        'No destination found with ID 999',
      );
    });

    it('should throw an error if the deletion fails due to invalid ID', async () => {
      (db.delete as jest.Mock).mockReturnValueOnce({
        where: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([]),
        }),
      });

      await expect(deleteDestinationById(-1)).rejects.toThrow(
        'No destination found with ID -1',
      );
    });

    it('should throw an error if deleting fails', async () => {
      (db.delete as jest.Mock).mockReturnValueOnce({
        where: jest.fn().mockReturnValue({
          returning: jest.fn().mockRejectedValue(new Error('Database error')),
        }),
      });

      await expect(deleteDestinationById(1)).rejects.toThrow(
        'Error deleting destination with ID 1: Database error',
      );
    });
  });
});
