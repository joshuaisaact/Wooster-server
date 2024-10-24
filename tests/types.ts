import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import type postgres from 'postgres';
import type { SuperTest, Test } from 'supertest';

export interface TestServer {
  db: PostgresJsDatabase<any>;
  sql: postgres.Sql<{}>;
  request: SuperTest<Test>;
  cleanup: () => Promise<void>;
}
