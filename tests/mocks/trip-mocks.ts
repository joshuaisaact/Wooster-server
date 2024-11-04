// helpers/trip-mocks.ts

import { TripDBRow } from '../../src/types/db-types';
import { Trip } from '../../src/types/trip-types';

// Mock data that simulates what comes from the database
export const dbTripMock: TripDBRow[] = [
  {
    tripId: 1,
    destinationId: 1,
    startDate: new Date(),
    numDays: 7,
    itineraryDays: 1,
    activities: {
      activityId: 1,
      activityName: 'Sightseeing',
      description: 'Explore the city',
      location: 'Central Park',
      price: '$0',
      latitude: '40.785091',
      longitude: '-73.968285',
      duration: '2 hours',
      difficulty: 'Challenging',
      category: 'Adventure',
      bestTime: 'Afternoon',
    },
    destination: {
      destinationId: 1,
      destinationName: 'New York',
      latitude: '40.712776',
      longitude: '-74.005974',
      description: 'The city that never sleeps',
      country: 'USA',
    },
  },
];

// Reshaped data expected by the application
export const reshapedTripMock: Trip = {
  tripId: '1',
  startDate: '2024-01-01',
  numDays: 7,
  itinerary: [
    {
      day: 1,
      activities: [
        {
          activityId: 1,
          activityName: 'Sightseeing',
          description: 'Explore the city',
          location: 'Central Park',
          price: '$0',
          latitude: '40.785091',
          longitude: '-73.968285',
          duration: '2 hours',
          difficulty: 'Challenging',
          category: 'Adventure',
          bestTime: 'Afternoon',
        },
      ],
    },
  ],
  destination: {
    destinationId: '1',
    destinationName: 'New York',
    latitude: '40.712776',
    longitude: '-74.005974',
    description: 'The city that never sleeps',
    country: 'USA',
  },
};
