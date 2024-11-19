import { addActivities } from '../../services/activity-service';
import { db } from '../../db';
import { activities } from '../../db';
import { DayItinerary } from '../../types/trip-types';

// Need to mock the DB since we don't want to hit it in tests
jest.mock('../../src/db', () => ({
  db: {
    insert: jest.fn(),
  },
  activities: {
    activityId: 'activityId',
  },
}));

describe('Activity Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Made this mock data match what the AI actually returns
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
          difficulty: 'Easy', // Changed from 'Challenging' to match actual data
          category: 'Sightseeing', // Changed from 'Adventure' to match actual data
          bestTime: 'Sunset', // Changed from 'Afternoon' to match actual data
        },
      ],
    },
  ];

  // First test - basic happy path
  it('adds activities to database', async () => {
    const destinationId = 1;
    const mockActivityIds = [{ activityId: 1 }];

    // Mock the DB response
    (db.insert as jest.Mock).mockReturnValue({
      values: jest.fn().mockReturnValue({
        returning: jest.fn().mockResolvedValue(mockActivityIds),
      }),
    });

    const result = await addActivities(mockItinerary, destinationId);

    expect(result).toEqual([[1]]);
    expect(db.insert).toHaveBeenCalledWith(activities);
  });

  // Added this when I realized we needed to handle empty data
  it('handles empty itinerary', async () => {
    const emptyItinerary: DayItinerary[] = [];
    const destinationId = 1;

    const result = await addActivities(emptyItinerary, destinationId);

    expect(result).toEqual([]);
    expect(db.insert).not.toHaveBeenCalled();
  });

  // Added after getting DB errors in testing
  it('handles database errors', async () => {
    const destinationId = 1;

    (db.insert as jest.Mock).mockReturnValue({
      values: jest.fn().mockReturnValue({
        returning: jest.fn().mockRejectedValue(new Error('DB error')),
      }),
    });

    await expect(addActivities(mockItinerary, destinationId)).rejects.toThrow(
      'DB error',
    );
  });
});
