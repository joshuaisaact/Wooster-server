import {
  pgTable,
  serial,
  uuid,
  integer,
  text,
  boolean,
  timestamp,
} from 'drizzle-orm/pg-core';
import { destinations } from './destinations';

export const savedDestinations = pgTable('saved_destinations', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id').notNull(),
  destinationId: integer('destination_id')
    .notNull()
    .references(() => destinations.destinationId, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  notes: text('notes'),
  isVisited: boolean('is_visited').default(false),
});
