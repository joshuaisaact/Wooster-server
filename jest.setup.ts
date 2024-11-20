import cleanupTestData from './src/tests/utils/test-cleanup';

beforeEach(async () => {
  jest.clearAllMocks();
});

afterEach(async () => {
  await cleanupTestData();
});
