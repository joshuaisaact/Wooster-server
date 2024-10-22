import { pgTable, bigint, timestamp } from 'drizzle-orm/pg-core';

export const itineraryDays = pgTable('itinerary_days', {
  dayId: bigint('day_id', { mode: 'number' }).notNull().primaryKey(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  tripId: bigint('trip_id', { mode: 'number' }),
  dayNumber: bigint('day_number', { mode: 'number' }),
  activityId: bigint('activity_id', { mode: 'number' }),
});
