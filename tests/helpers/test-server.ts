import app from '../../src';
import { clearTestDb, setupTestDb } from './db';
import supertest from 'supertest';

export async function setupTestServer() {
  try {
    const { db, sql } = await setupTestDb(); // Ensure this doesn't fail
    const request = supertest(app);

    return {
      db,
      sql,
      request,
      cleanup: async () => {
        await clearTestDb(sql); // Only passing sql as discussed earlier
        await sql.end();
      },
    };
  } catch (error) {
    console.error('Error setting up the test server:', error);
    throw error; // Rethrow error to ensure it bubbles up
  }
}
