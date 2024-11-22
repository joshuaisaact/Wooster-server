import { sql } from 'drizzle-orm';
import { testDb } from '../setup/test-db';

export const resetSequences = async () => {
  await testDb.execute(sql`
    DO $$
    DECLARE
      r RECORD;
    BEGIN
      FOR r IN (SELECT sequencename FROM pg_sequences WHERE schemaname = 'public') LOOP
        EXECUTE 'ALTER SEQUENCE ' || r.sequencename || ' RESTART WITH 1';
      END LOOP;
    END $$;
  `);
};
