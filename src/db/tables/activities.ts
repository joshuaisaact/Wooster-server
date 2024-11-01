import {
  pgTable,
  text,
  numeric,
  timestamp,
  integer,
  serial,
} from 'drizzle-orm/pg-core';

export const activities = pgTable('activities', {
  activityId: serial('activity_id').primaryKey(),
  activityName: text('activity_name'),
  description: text('description'),
  location: text('location'),
  latitude: numeric('latitude'),
  longitude: numeric('longitude'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  price: text('price'),
  locationId: integer('location_id'),
  duration: text('duration'),
  difficulty: text('difficulty'),
  category: text('category'),
  bestTime: text('best_time'),
});
