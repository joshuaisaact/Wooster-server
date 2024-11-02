import request from 'supertest';
import app from '../src';

describe('Express App Setup', () => {
  it('should allow CORS from allowed origins', async () => {
    const isDevelopment = process.env.NODE_ENV !== 'production';
    const testOrigins = isDevelopment
      ? ['http://localhost:5173']
      : [
          'http://46.101.72.66',
          'https://trywooster.live',
          'https://www.trywooster.live',
        ];

    // Test each allowed origin
    for (const origin of testOrigins) {
      const res = await request(app)
        .options('/')
        .set('Origin', origin)
        .expect(204);

      expect(res.headers['access-control-allow-origin']).toBe(origin);
    }
  });

  it('should respond with 404 for unknown routes', async () => {
    const res = await request(app).get('/unknown-route').expect(404);

    console.log(res.body);

    expect(res.body).toEqual({ error: 'Not Found' });
  });
});
