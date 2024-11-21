import { testDb } from '../setup/test-db';
import {
  activities,
  destinations,
  itineraryDays,
  savedDestinations,
  trips,
} from '@/db';

const isIntegrationTest = process.env.TEST_FILE_PATH?.includes('/integration/');

const clearTables = async () => {
  if (!isIntegrationTest) return;

  await Promise.all([
    testDb.delete(trips),
    testDb.delete(activities),
    testDb.delete(destinations),
    testDb.delete(itineraryDays),
    testDb.delete(savedDestinations),
  ]);
};

beforeEach(async () => {
  jest.clearAllMocks();
  await clearTables();
});

afterAll(async () => {});
