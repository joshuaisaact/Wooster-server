import { addActivities } from '../../src/services/activity-service';
import { db } from '../../src/db';
import { activities } from '../../src/db';
import { DayItinerary } from '../../src/types/trip-types';

// Mock both db and activities table
jest.mock('../../src/db', () => ({
  db: {
    insert: jest.fn(),
  },
  activities: {
    activityId: 'activityId', // Mock the column reference
  },
}));

describe('Activity Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockItinerary: DayItinerary[] = [
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

  it('should add activities successfully', async () => {
    const destinationId = 1;
    const mockActivityIds = [{ activityId: 1 }];

    // Mock the chained methods
    (db.insert as jest.Mock).mockReturnValue({
      values: jest.fn().mockReturnValue({
        returning: jest.fn().mockResolvedValue(mockActivityIds),
      }),
    });

    const result = await addActivities(mockItinerary, destinationId);

    expect(result).toEqual([[1]]);
    expect(db.insert).toHaveBeenCalledWith(activities);
  });

  it('should handle empty itinerary gracefully', async () => {
    const emptyItinerary: DayItinerary[] = [];
    const destinationId = 1;

    const result = await addActivities(emptyItinerary, destinationId);

    expect(result).toEqual([]);
    expect(db.insert).not.toHaveBeenCalled();
  });

  it('should handle database errors gracefully', async () => {
    const destinationId = 1;

    // Mock the error case
    (db.insert as jest.Mock).mockReturnValue({
      values: jest.fn().mockReturnValue({
        returning: jest
          .fn()
          .mockRejectedValue(new Error('Database insertion error')),
      }),
    });

    await expect(addActivities(mockItinerary, destinationId)).rejects.toThrow(
      'Database insertion error',
    );
  });
});
