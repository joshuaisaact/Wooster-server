import { sql } from 'drizzle-orm';
import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const activities = sqliteTable('activities', {
  activityId: integer('activity_id').primaryKey({ autoIncrement: true }),
  activityName: text('activity_name'),
  description: text('description'),
  location: text('location'),
  latitude: real('latitude'),
  longitude: real('longitude'),
  createdAt: text('created_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  price: text('price'),
  locationId: integer('location_id'),
  duration: text('duration'),
  difficulty: text('difficulty'),
  category: text('category'),
  bestTime: text('best_time'),
});
