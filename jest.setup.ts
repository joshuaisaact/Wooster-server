import { closeTestDb } from './src/tests/setup/test-db'; // Adjust path accordingly

beforeEach(async () => {
  // await clearAllTables();
  jest.clearAllMocks();
});

afterAll(() => {
  // Close the SQLite database after all tests
  closeTestDb();
});
