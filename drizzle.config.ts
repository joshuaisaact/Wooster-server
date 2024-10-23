import dotenv from 'dotenv';
import { defineConfig } from 'drizzle-kit';

dotenv.config();

const isTestEnv = process.env.NODE_ENV === 'test';

if (!isTestEnv && !process.env.SUPABASE_URL) {
  throw new Error('SUPABASE_URL is required in non-test environments');
}

const TEST_DB_URL = 'postgres://test_user:test_password@localhost:5433/test_db';

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: isTestEnv ? TEST_DB_URL : process.env.SUPABASE_URL!,
  },
});
