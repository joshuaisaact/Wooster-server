import {
  createDatabaseError,
  createServiceError,
} from '@/utils/error-handlers';

describe('Error Handler', () => {
  it('creates a service error', () => {
    const message = 'Service error';
    const status = 500;
    const code = 'AUTHENTICATION_ERROR';
    const details = { someDetail: 'details' };

    const error = createServiceError(message, status, code, details);

    expect(error).toEqual({
      message,
      status,
      code,
      details,
    });
  });

  it('creates a database error', () => {
    const message = 'Database connection failed';
    const status = 503;
    const code = 'DB_CONNECTION_ERROR';
    const details = { host: 'localhost' };

    const error = createDatabaseError(message, status, code, details);

    expect(error).toEqual({
      message,
      status,
      code,
      details,
    });
  });
});
