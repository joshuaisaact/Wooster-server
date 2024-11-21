import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const itineraryDays = sqliteTable('itinerary_days', {
  dayId: integer('day_id').primaryKey({ autoIncrement: true }),
  createdAt: text('created_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  tripId: integer('trip_id'),
  dayNumber: integer('day_number'),
  activityId: integer('activity_id'),
});
