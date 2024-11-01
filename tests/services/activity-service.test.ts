// tests/activity-service.test.ts
import { addActivities } from '../../src/services/activity-service';
import { db } from '../../src/db'; // Import your database connection
import { DayItinerary } from '../../src/types/trip-types';

jest.mock('../../src/db');

describe('Activity Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('addActivities', () => {
    it('should add activities successfully', async () => {
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
              duration: '2 hours',
              difficulty: 'Challenging',
              category: 'Adventure',
              bestTime: 'Afternoon',
            },
            {
              activityId: 2,
              activityName: 'Louvre Museum Tour',
              description: 'Explore the famous Louvre Museum.',
              location: 'Paris, France',
              price: '15',
              latitude: '48.8606',
              longitude: '2.3376',
              duration: '2 hours',
              difficulty: 'Challenging',
              category: 'Adventure',
              bestTime: 'Afternoon',
            },
          ],
        },
      ];
      const destinationId = 1;
      const mockActivityIds = [{ activityId: 1 }, { activityId: 2 }];

      (db.insert as jest.Mock).mockReturnValueOnce({
        values: jest.fn().mockResolvedValue(mockActivityIds),
        returning: jest.fn().mockResolvedValue(mockActivityIds),
      });

      const result = await addActivities(itinerary, destinationId);

      expect(result).toEqual([[1, 2]]);
      expect(db.insert).toHaveBeenCalledWith(expect.anything());
    });

    it('should handle empty itinerary gracefully', async () => {
      const itinerary: DayItinerary[] = [];
      const destinationId = 1;

      const result = await addActivities(itinerary, destinationId);

      expect(result).toEqual([]); // Expect an empty array since there were no activities
      expect(db.insert).not.toHaveBeenCalled();
    });

    it('should handle database errors gracefully when inserting activities', async () => {
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
              duration: '2 hours',
              difficulty: 'Challenging',
              category: 'Adventure',
              bestTime: 'Afternoon',
            },
          ],
        },
      ];
      const destinationId = 1;

      (db.insert as jest.Mock).mockReturnValueOnce({
        values: jest
          .fn()
          .mockRejectedValue(new Error('Database insertion error')),
      });

      await expect(addActivities(itinerary, destinationId)).rejects.toThrow(
        'Error inserting activities: Database insertion error',
      );
    });
  });
});
