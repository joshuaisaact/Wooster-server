import { pgTable, bigint, timestamp, uuid } from 'drizzle-orm/pg-core';

export const trips = pgTable('trips', {
  tripId: bigint('trip_id', { mode: 'number' }).notNull().primaryKey(),
  userId: uuid('user_id').notNull(),
  destinationId: bigint('destination_id', { mode: 'number' }),
  startDate: timestamp('start_date', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  numDays: bigint('num_days', { mode: 'number' }),
});
