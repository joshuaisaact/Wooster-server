import {
  pgTable,
  bigint,
  timestamp,
  uuid,
  serial,
  text,
} from 'drizzle-orm/pg-core';

export const trips = pgTable('trips', {
  tripId: serial('trip_id').primaryKey(),
  userId: uuid('user_id').notNull(),
  destinationId: bigint('destination_id', { mode: 'number' }),
  startDate: timestamp('start_date', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  numDays: bigint('num_days', { mode: 'number' }),
  title: text('title'),
  description: text('description'),
  status: text('status').default('PLANNING').notNull(),
});
