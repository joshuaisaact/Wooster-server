import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle/sqlite',
  schema: './src/db/test/*.ts',
  dialect: 'sqlite',
  dbCredentials: {
    url: ':memory:',
  },
  verbose: true,
  strict: true,
});
