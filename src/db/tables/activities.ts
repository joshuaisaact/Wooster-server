import {
  pgTable,
  bigint,
  text,
  numeric,
  timestamp,
  integer,
} from 'drizzle-orm/pg-core';

export const activities = pgTable('activities', {
  activityId: bigint('activity_id', { mode: 'number' }).notNull().primaryKey(),
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
});
