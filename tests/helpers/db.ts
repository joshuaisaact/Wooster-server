import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { trips } from '../../src/db';
import { itineraryDays } from '../../src/db';
import { activities } from '../../src/db';
import { destinations } from '../../src/db';

const TEST_DB_URL = 'postgres://test_user:test_password@localhost:5433/test_db';

export async function setupTestDb() {
  if (process.env.NODE_ENV !== 'test') {
    throw new Error('setupTestDb should only be called in test environment');
  }

  const sql = postgres(TEST_DB_URL);
  const db = drizzle(sql, {
    schema: {
      trips,
      itineraryDays,
      activities,
      destinations,
    },
  });

  // Run migrations
  await migrate(db, { migrationsFolder: './drizzle' });

  return { db, sql };
}

export async function clearTestDb(sql: postgres.Sql) {
  const tables = ['activities', 'itinerary_days', 'trips', 'destinations'];
  for (const table of tables) {
    await sql`TRUNCATE TABLE "${table}" CASCADE`;
  }
}
