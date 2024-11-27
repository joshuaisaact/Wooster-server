import { pgTable, serial, uuid, timestamp, text } from 'drizzle-orm/pg-core';
import { trips } from './trips';

export const sharedTrips = pgTable('shared_trips', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id').notNull(),
  tripId: serial('trip_id')
    .notNull()
    .references(() => trips.tripId, { onDelete: 'cascade' }),
  shareCode: text('share_code').notNull().unique(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true }),
});
