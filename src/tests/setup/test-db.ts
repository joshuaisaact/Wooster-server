import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import 'dotenv/config';

import * as schema from '../../db/tables';

const databaseUrl = process.env.TEST_DATABASE_URL || process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    'Neither DATABASE_URL nor TEST_DATABASE_URL is defined. Please set one in your .env file.',
  );
}

const sql = postgres(databaseUrl);
export const testDb = drizzle(sql, { schema });
