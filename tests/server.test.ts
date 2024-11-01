import request from 'supertest';
import app from '../src/index';
import http from 'http';

describe('Server Tests', () => {
  let server: http.Server;
  let port: number;

  beforeAll((done) => {
    server = app.listen(0, () => {
      port = (server.address() as any).port;
      done();
    });
  });

  afterAll((done) => {
    server.close(done);
  });

  it('should start the server and respond to a basic request', async () => {
    const response = await request(`http://localhost:${port}`).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toContain('Welcome to the server!');
  });

  it('should log the correct startup message', () => {
    const consoleLogSpy = jest.spyOn(console, 'log');
    const logMessage = '🚀 Server is running successfully!';

    server = app.listen(port, () => {
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining(logMessage),
      );
    });

    consoleLogSpy.mockRestore();
  });
});
