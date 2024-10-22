import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

async function main() {
  const databaseUrl = process.env.SUPABASE_URL;

  if (!databaseUrl) {
    throw new Error(
      'DATABASE_URL is not defined. Please set it in your .env file.',
    );
  }
  const sql = postgres(databaseUrl);

  const db = drizzle(sql);

  console.log('Drizzle with postgres-js initialized successfully!');
}
main().catch((err) => {
  console.error('Error initializing Drizzle:', err);
});
