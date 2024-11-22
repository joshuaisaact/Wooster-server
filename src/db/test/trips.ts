import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const trips = sqliteTable('trips', {
  tripId: integer('trip_id').primaryKey({ autoIncrement: true }),
  userId: text('user_id').notNull(),
  destinationId: integer('destination_id'),
  startDate: text('start_date'),
  createdAt: text('created_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  numDays: integer('num_days'),
});
