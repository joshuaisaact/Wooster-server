import {
  pgTable,
  bigint,
  timestamp,
  serial,
  integer,
} from 'drizzle-orm/pg-core';

export const itineraryDays = pgTable('itinerary_days', {
  dayId: serial('day_id').primaryKey(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  tripId: bigint('trip_id', { mode: 'number' }),
  dayNumber: bigint('day_number', { mode: 'number' }),
  activityId: bigint('activity_id', { mode: 'number' }),
  slotNumber: integer('slot_number'),
});
