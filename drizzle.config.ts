import dotenv from 'dotenv';
import { defineConfig } from 'drizzle-kit';

dotenv.config();

export default defineConfig({
  out: './drizzle/pg',
  schema: './src/db/tables/*.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.SUPABASE_URL!,
  },
  verbose: true,
  strict: true,
  tablesFilter: ['!_*'],
});
