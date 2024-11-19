import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import 'dotenv/config';
import { createDatabaseConnectionError } from '../types/errors';
import { logger } from '../utils/logger';

// Table schemas
import { trips } from './tables/trips';
import { itineraryDays } from './tables/itinerary_days';
import { activities } from './tables/activities';
import { destinations } from './tables/destinations';
import { savedDestinations } from './tables/saved_destinations';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  const errorMessage =
    'DATABASE_URL is not defined. Please set it in your .env file.';
  logger.error({}, errorMessage);
  throw createDatabaseConnectionError(errorMessage);
}

// Add debug options to postgres client
const sql = postgres(databaseUrl, {
  debug: (_, query, params) => {
    console.log('🔍 DB DEBUG:', { query, params, databaseUrl });
  },
  onnotice: (notice) => {
    console.log('🔍 DB NOTICE:', notice);
  },
  onparameter: (parameterName, value) => {
    console.log('🔍 DB PARAMETER:', { parameterName, value });
  },
});

const db = drizzle(sql);

export {
  db,
  trips,
  itineraryDays,
  activities,
  destinations,
  savedDestinations,
};
