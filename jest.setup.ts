import {
  activities,
  db,
  destinations,
  itineraryDays,
  savedDestinations,
  trips,
} from './src/db';

beforeEach(async () => {
  jest.clearAllMocks();
});

afterEach(async () => {
  await db.delete(trips);
  await db.delete(itineraryDays);
  await db.delete(activities);
  await db.delete(destinations);
  await db.delete(savedDestinations);
});
