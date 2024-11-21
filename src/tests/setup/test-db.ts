import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import 'dotenv/config';

import * as schema from '../../db/tables';

const databaseUrl = process.env.TEST_DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    'DATABASE_URL is not defined. Please set it in your .env file.',
  );
}

const sql = postgres(databaseUrl);
export const testDb = drizzle(sql, { schema });
