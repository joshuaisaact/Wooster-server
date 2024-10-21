import request from 'supertest';
import app from '../src/index';
import supabase from '../src/models/supabase-client';

describe('Trips API', () => {
  beforeEach(async () => {
    await supabase.rpc('start_transaction');
  });

  afterEach(async () => {
    await supabase.rpc('rollback_transaction');
  });

  describe('GET /trips', () => {
    it('should return a list of trips', async () => {
      const res = await request(app).get('/trips').expect(200);

      expect(res.body).toBeInstanceOf(Array);

      if (res.body.length > 0) {
        expect(res.body[0]).toHaveProperty('trip_id');
        expect(res.body[0]).toHaveProperty('destination_name');
        expect(res.body[0]).toHaveProperty('itinerary');
        expect(res.body[0]).toHaveProperty('num_days');
      }
    });
  });
});
