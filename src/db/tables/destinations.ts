import {
  bigint,
  text,
  numeric,
  varchar,
  timestamp,
  pgTable,
} from 'drizzle-orm/pg-core';

export const destinations = pgTable('destinations', {
  destinationId: bigint('destination_id', { mode: 'number' })
    .notNull()
    .primaryKey(),
  destinationName: text('destination_name'),
  latitude: numeric('latitude'),
  longitude: numeric('longitude'),
  description: text('description'),
  country: text('country'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  bestTimeToVisit: varchar('best_time_to_visit'),
  averageTemperatureLow: text('average_temperature_low'),
  averageTemperatureHigh: text('average_temperature_high'),
  popularActivities: text('popular_activities'),
  travelTips: text('travel_tips'),
  nearbyAttractions: text('nearby_attractions'),
  transportationOptions: text('transportation_options'),
  accessibilityInfo: text('accessibility_info'),
  officialLanguage: varchar('official_language'),
  currency: varchar('currency'),
  localCuisine: text('local_cuisine'),
  costLevel: varchar('cost_level'),
  safetyRating: text('safety_rating'),
  culturalSignificance: text('cultural_significance'),
  userRatings: text('user_ratings'),
});
