import request from 'supertest';
import { Server } from 'http';
import app from '../src/index';

describe('Server Tests', () => {
  let server: Server;
  const port = 59781;

  // Setup before tests
  beforeAll((done) => {
    server = app.listen(port, () => {
      console.log(`Test server running on port ${port}`);
      done();
    });
  });

  // Cleanup after tests
  afterAll((done) => {
    if (server) {
      server.close(done);
    } else {
      done();
    }
  });

  it('should start the server and respond to a basic request', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toContain('Welcome to the server!');
  });
});
