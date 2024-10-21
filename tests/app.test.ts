import request from 'supertest';
import app from '../src';

describe('Express App Setup', () => {
  it('should allow CORS from the correct origin', async () => {
    const res = await request(app)
      .options('/')
      .set('Origin', process.env.CLIENT_URL || 'http://localhost:5173')
      .expect(204);

    expect(res.headers['access-control-allow-origin']).toBe(
      process.env.CLIENT_URL || 'http://localhost:5173',
    );
  });

  it('should respond with 404 for unknown routes', async () => {
    const res = await request(app).get('/unknown-route').expect(404);

    console.log(res.body);

    expect(res.body).toEqual({ error: 'Not Found' });
  });
});
