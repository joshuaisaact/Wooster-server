import {
  addItineraryDays,
  deleteItineraryDaysByTripId,
} from '../../src/services/itinerary-service';
import { db } from '../../src/db'; // Import your database connection
import { DayItinerary } from '../../src/types/trip-types'; // Import the type for DayItinerary

jest.mock('../../src/db'); // Mock the db module

describe('Itinerary Service', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  describe('addItineraryDays', () => {
    describe('addItineraryDays', () => {
      it('should add itinerary days successfully', async () => {
        const tripId = 1;
        const itinerary: DayItinerary[] = [
          {
            day: 1,
            activities: [
              {
                activityId: 1,
                activityName: 'Eiffel Tower Visit',
                description: 'Visit the iconic Eiffel Tower in Paris.',
                location: 'Paris, France',
                price: '25',
                latitude: '48.8584',
                longitude: '2.2945',
              },
              {
                activityId: 2,
                activityName: 'Louvre Museum Tour',
                description: 'Explore the famous Louvre Museum.',
                location: 'Paris, France',
                price: '15',
                latitude: '48.8606',
                longitude: '2.3376',
              },
            ],
          },
          {
            day: 2,
            activities: [
              {
                activityId: 3,
                activityName: 'Seine River Cruise',
                description: 'Enjoy a scenic cruise on the Seine River.',
                location: 'Paris, France',
                price: '30',
                latitude: '48.8566',
                longitude: '2.3522',
              },
            ],
          },
        ];

        const activityIds = [[1, 2], [3]]; // Corresponding activity IDs for the itinerary

        (db.insert as jest.Mock).mockReturnValueOnce({
          values: jest.fn().mockResolvedValue(undefined), // Simulate successful insertion
        });

        await expect(
          addItineraryDays(tripId, itinerary, activityIds),
        ).resolves.toBeUndefined();
        expect(db.insert).toHaveBeenCalledWith(expect.anything());
      });

      it('should throw an error if itinerary is empty', async () => {
        const tripId = 1;
        const emptyItinerary: DayItinerary[] = [];
        const activityIds: number[][] = [];

        await expect(
          addItineraryDays(tripId, emptyItinerary, activityIds),
        ).rejects.toThrow('Itinerary cannot be empty');
      });

      it('should throw an error if activityIds length does not match itinerary length', async () => {
        const tripId = 1;
        const itinerary: DayItinerary[] = [
          { day: 1, activities: [] },
          { day: 2, activities: [] },
        ];
        const activityIds: number[][] = [[1]]; // Mismatch in length

        await expect(
          addItineraryDays(tripId, itinerary, activityIds),
        ).rejects.toThrow(
          'Activity IDs must match itinerary length', // Ensure you have this validation in the service
        );
      });

      it('should handle database errors gracefully when inserting', async () => {
        const tripId = 1;
        const itinerary: DayItinerary[] = [
          {
            day: 1,
            activities: [
              {
                activityId: 1,
                activityName: 'Eiffel Tower Visit',
                description: 'Visit the iconic Eiffel Tower in Paris.',
                location: 'Paris, France',
                price: '25',
                latitude: '48.8584',
                longitude: '2.2945',
              },
            ],
          },
        ];
        const activityIds: number[][] = [[1]];

        (db.insert as jest.Mock).mockReturnValueOnce({
          values: jest
            .fn()
            .mockRejectedValue(new Error('Database insertion error')),
        });

        await expect(
          addItineraryDays(tripId, itinerary, activityIds),
        ).rejects.toThrow(
          'Error inserting itinerary days: Database insertion error',
        );
      });
    });

    describe('deleteItineraryDaysByTripId', () => {
      it('should throw an error if deleting itinerary days fails', async () => {
        const tripId = 1;

        (db.delete as jest.Mock).mockReturnValueOnce({
          where: jest.fn().mockRejectedValue(new Error('Database error')),
        });

        await expect(deleteItineraryDaysByTripId(tripId)).rejects.toThrow(
          'Error deleting itinerary days for trip 1: Database error',
        );
      });
    });
  });
});
