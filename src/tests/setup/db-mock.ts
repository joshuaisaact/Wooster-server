import { jest } from '@jest/globals';

jest.mock('../../database/db', () => ({
  db: {
    select: jest.fn(),
    from: jest.fn(),
  },
}));
