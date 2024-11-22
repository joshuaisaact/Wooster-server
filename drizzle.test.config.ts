import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle', // Directory to output the migration files
  schema: './src/db/tables/*.ts', // Path to your test schema (same as production schema)
  dialect: 'postgresql', // Use PostgreSQL since you're using pgmem (in-memory PostgreSQL)
  dbCredentials: {
    url:
      process.env.TEST_DATABASE_URL ||
      'postgres://testuser:testpassword@localhost:5432/testdb', // Connection string (pgmem creates an in-memory PostgreSQL database)
  },
  verbose: true,
  strict: false,
  migrations: {
    prefix: 'timestamp', // Migration file prefix
    table: '__drizzle_migrations__', // Table to track migrations
    schema: 'public', // Schema to use for migrations
  },
});
