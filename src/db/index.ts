import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

// Table schemas
import { trips } from './tables/trips';
// import { itineraryDays } from './tables/itinerary_days';
// import { activities } from './tables/activities';
// import { destinations } from './tables/destinations';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    'DATABASE_URL is not defined. Please set it in your .env file.',
  );
}

const sql = postgres(databaseUrl);
const db = drizzle(sql);

// Export both `db` and the table schemas
export { db, trips };
