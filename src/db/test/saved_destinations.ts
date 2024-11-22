import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { destinations } from './destinations';

export const savedDestinations = sqliteTable('saved_destinations', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id').notNull(),
  destinationId: integer('destination_id')
    .notNull()
    .references(() => destinations.destinationId, { onDelete: 'cascade' }),
  createdAt: text('created_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  notes: text('notes'),
  isVisited: integer('is_visited', { mode: 'boolean' }).default(false),
});
