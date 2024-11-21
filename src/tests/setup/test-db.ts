import { drizzle } from 'drizzle-orm/node-postgres';
import * as pgmem from 'pgmem';
import { migrate } from 'drizzle-orm/node-postgres/migrator';

// Create an in-memory PostgreSQL instance
const pg = pgmem();
const db = drizzle(pg); // Drizzle ORM setup for pgmem

// Apply migrations dynamically at runtime
await migrate(db); // Apply the migrations defined in your schema

// Export the test database instance for your tests
export const testDb = db;
