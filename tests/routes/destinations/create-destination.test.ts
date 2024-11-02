import request from 'supertest';
import app from '../../../src/index';
import supabase from '../../../src/models/supabase-client';
import { generateDestinationData } from '../../../src/services/google-ai-service';
import * as destinationService from '../../../src/services/destination-service';
import { CreateMockDestination } from '../../../src/types/test-types';
import { User } from '@supabase/supabase-js';
import { NextFunction } from 'express';
import { mockAuthHeader } from '../../helpers/auth-mocks';

// Mock the auth middleware
jest.mock('../../../src/middleware/auth-middleware', () => ({
  requireAuth: (
    req: Request & { user?: User },
    _res: Response,
    next: NextFunction,
  ) => {
    req.user = {
      id: 'test-user-id',
      app_metadata: {},
      aud: 'authenticated',
      created_at: '',
      role: '',
      user_metadata: {},
    } as User;
    next();
  },
}));

// Mock both services
jest.mock('../../../src/services/google-ai-service');
jest.mock('../../../src/services/destination-service');

// Type the mocked functions
const mockedGenerateDestinationData =
  generateDestinationData as jest.MockedFunction<
    typeof generateDestinationData
  >;
const mockedAddDestination = jest.spyOn(destinationService, 'addDestination');

interface DatabaseViolationError extends Error {
  code: string;
}

interface UnknownErrorType {
  notAnError: string;
}

describe('Destination Routes', () => {
  beforeEach(async () => {
    await supabase.rpc('start_transaction');
    jest.clearAllMocks();
  });

  afterEach(async () => {
    await supabase.rpc('rollback_transaction');
  });

  const mockDestinationData: CreateMockDestination = {
    destinationName: 'Paris',
    latitude: '48.8566',
    longitude: '2.3522',
    description:
      'The City of Light, known for its iconic Eiffel Tower and world-class cuisine',
    country: 'France',
  };

  describe('POST /destination', () => {
    describe('successful creation', () => {
      it('should create a new destination successfully', async () => {
        mockedGenerateDestinationData.mockResolvedValue(
          JSON.stringify(mockDestinationData),
        );

        const res = await request(app)
          .post('/api/destination')
          .set('Authorization', mockAuthHeader)
          .send({ destination: 'Paris' })
          .expect(201);

        expect(res.body).toHaveProperty(
          'message',
          'Destination created successfully',
        );
        expect(res.body).toHaveProperty('destination');
        expect(res.body.destination).toHaveProperty('destinationName', 'Paris');
      });
    });

    describe('validation errors', () => {
      it('should return 400 when destination is missing', async () => {
        const res = await request(app)
          .post('/api/destination')
          .set('Authorization', mockAuthHeader)
          .send({})
          .expect(400);
        expect(res.body).toHaveProperty('error', 'Destination is required');
      });

      it('should handle empty string destination', async () => {
        const res = await request(app)
          .post('/api/destination')
          .set('Authorization', mockAuthHeader)
          .send({ destination: '' })
          .expect(400);

        expect(res.body).toHaveProperty('error', 'Destination is required');
      });
    });

    describe('AI service errors', () => {
      it('should handle AI service errors', async () => {
        mockedGenerateDestinationData.mockRejectedValue(
          new Error('AI service error'),
        );

        const res = await request(app)
          .post('/api/destination')
          .set('Authorization', mockAuthHeader)
          .send({ destination: 'Paris' })
          .expect(500);

        expect(res.body).toHaveProperty(
          'error',
          'Failed to generate destination data',
        );
      });

      it('should handle invalid AI response format', async () => {
        mockedGenerateDestinationData.mockResolvedValue('invalid json');

        const res = await request(app)
          .post('/api/destination')
          .set('Authorization', mockAuthHeader)
          .send({ destination: 'Paris' })
          .expect(500);

        expect(res.body).toHaveProperty(
          'error',
          'Failed to parse destination data',
        );
      });

      it('should handle undefined response from AI service', async () => {
        mockedGenerateDestinationData.mockResolvedValue(
          undefined as unknown as string,
        );

        const res = await request(app)
          .post('/api/destination')
          .set('Authorization', mockAuthHeader)
          .send({ destination: 'Paris' })
          .expect(500);

        expect(res.body).toHaveProperty(
          'error',
          'Failed to generate destination data',
        );
      });

      it('should handle null response from AI service', async () => {
        mockedGenerateDestinationData.mockResolvedValue(
          null as unknown as string,
        );

        const res = await request(app)
          .post('/api/destination')
          .set('Authorization', mockAuthHeader)
          .send({ destination: 'Paris' })
          .expect(500);

        expect(res.body).toHaveProperty(
          'error',
          'Failed to parse destination data',
        );
      });
    });

    describe('database errors', () => {
      it('should handle malformed destination data', async () => {
        mockedGenerateDestinationData.mockResolvedValue(
          JSON.stringify({
            someInvalidField: 'value',
          }),
        );

        mockedAddDestination.mockRejectedValue(
          new Error('Invalid destination data format'),
        );

        const res = await request(app)
          .post('/api/destination')
          .set('Authorization', mockAuthHeader)
          .send({ destination: 'Paris' })
          .expect(500);

        expect(res.body).toHaveProperty(
          'error',
          'Invalid destination data format',
        );
      });

      it('should handle database errors', async () => {
        mockedGenerateDestinationData.mockResolvedValue(
          JSON.stringify(mockDestinationData),
        );

        mockedAddDestination.mockRejectedValue(new Error('Database error'));

        const res = await request(app)
          .post('/api/destination')
          .set('Authorization', mockAuthHeader)
          .send({ destination: 'Paris' })
          .expect(500);

        expect(res.body).toHaveProperty('error', 'Database error');
      });

      it('should handle database constraint violations', async () => {
        mockedGenerateDestinationData.mockResolvedValue(
          JSON.stringify(mockDestinationData),
        );

        const uniqueViolationError: DatabaseViolationError = new Error(
          'Duplicate key value violates unique constraint',
        ) as DatabaseViolationError;
        uniqueViolationError.code = '23505';
        mockedAddDestination.mockRejectedValue(uniqueViolationError);

        const res = await request(app)
          .post('/api/destination')
          .set('Authorization', mockAuthHeader)
          .send({ destination: 'Paris' })
          .expect(409);

        expect(res.body).toHaveProperty('error', 'Destination already exists');
      });

      it('should handle unknown errors', async () => {
        mockedGenerateDestinationData.mockResolvedValue(
          JSON.stringify(mockDestinationData),
        );

        const unknownError: UnknownErrorType = {
          notAnError: 'some unknown error type',
        };
        mockedAddDestination.mockRejectedValue(unknownError);

        const res = await request(app)
          .post('/api/destination')
          .set('Authorization', mockAuthHeader)
          .send({ destination: 'Paris' })
          .expect(500);

        expect(res.body).toHaveProperty('error', 'An unknown error occurred');
      });
    });
  });
});
