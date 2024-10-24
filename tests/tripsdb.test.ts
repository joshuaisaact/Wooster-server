import request from 'supertest';
import app from '../src/index'; // Ensure the correct path to your app
import { setupTestServer } from './helpers/test-server';

describe('Trips API', () => {
  let server: any;

  beforeAll(async () => {
    server = await setupTestServer(); // Setup the test server and database
  });

  afterAll(async () => {
    if (server && server.cleanup) {
      await server.cleanup(); // Cleanup the server after tests
    }
  });

  describe('POST /trip', () => {
    it('should create a new trip', async () => {
      const tripData = {
        destinationId: 1,
        startDate: '2024-05-01',
        numDays: 3,
        itineraryDays: [], // Assuming an empty itinerary initially
        destinations: {
          destinationId: '1',
          destinationName: 'Paris',
          latitude: '48.8566',
          longitude: '2.3522',
          description: 'A wonderful trip to Paris',
          country: 'France',
        },
      };

      const res = await request(app).post('/trip').send(tripData).expect(201);

      // Check response structure
      expect(res.body).toHaveProperty('tripId');
      expect(res.body).toMatchObject({
        destinationId: tripData.destinationId,
        startDate: tripData.startDate,
        numDays: tripData.numDays,
        destinations: {
          destinationId: tripData.destinations.destinationId,
          destinationName: tripData.destinations.destinationName,
          latitude: tripData.destinations.latitude,
          longitude: tripData.destinations.longitude,
          description: tripData.destinations.description,
          country: tripData.destinations.country,
        },
      });

      // Verify the data was actually saved in the database
      const savedTrip = await server.sql`
        SELECT * FROM trips WHERE trip_id = ${res.body.tripId}
      `.then((results: any[]) => results[0]);

      expect(savedTrip).toMatchObject({
        destination_id: tripData.destinationId,
        start_date: new Date(tripData.startDate), // Ensure date matches
        num_days: tripData.numDays,
      });
    });

    it('should return 400 for invalid trip data', async () => {
      const invalidTripData = {
        // Missing required fields
        startDate: '2024-05-01',
        numDays: 3,
      };

      const res = await request(app)
        .post('/trip')
        .send(invalidTripData)
        .expect(400);

      expect(res.body).toHaveProperty('error');
      expect(res.body.error).toMatch(/Missing required fields/);
    });

    it('should validate date ranges', async () => {
      const invalidDateRangeTrip = {
        destinationId: 1,
        startDate: '2024-05-03',
        numDays: 3,
        destinations: {
          destinationId: '1',
          destinationName: 'Paris',
          latitude: '48.8566',
          longitude: '2.3522',
          description: 'A wonderful trip to Paris',
          country: 'France',
        },
      };

      const res = await request(app)
        .post('/trip')
        .send(invalidDateRangeTrip)
        .expect(400);

      expect(res.body.error).toMatch(/Invalid date range/i);
    });
  });

  describe('GET /trips', () => {
    it('should return created trip in trips list', async () => {
      // First, create a new trip
      const tripData = {
        destinationId: 1,
        startDate: '2024-05-01',
        numDays: 3,
        itineraryDays: [], // Assuming an empty itinerary initially
        destinations: {
          destinationId: '1',
          destinationName: 'Paris',
          latitude: '48.8566',
          longitude: '2.3522',
          description: 'A wonderful trip to Paris',
          country: 'France',
        },
      };

      const createRes = await request(app)
        .post('/trip')
        .send(tripData)
        .expect(201);

      // Then, verify it appears in the GET /trips response
      const getRes = await request(app).get('/trips').expect(200);

      expect(getRes.body).toBeInstanceOf(Array);
      expect(getRes.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            tripId: createRes.body.tripId,
            destinationId: tripData.destinationId,
            startDate: tripData.startDate,
            numDays: tripData.numDays,
            destinations: {
              destinationId: tripData.destinations.destinationId,
              destinationName: tripData.destinations.destinationName,
              latitude: tripData.destinations.latitude,
              longitude: tripData.destinations.longitude,
              description: tripData.destinations.description,
              country: tripData.destinations.country,
            },
          }),
        ]),
      );
    });
  });
});
