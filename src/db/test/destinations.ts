import { sql } from 'drizzle-orm';
import { sqliteTable, text, real, integer } from 'drizzle-orm/sqlite-core';

export const destinations = sqliteTable('destinations', {
  destinationId: integer('destination_id').primaryKey({ autoIncrement: true }),
  destinationName: text('destination_name').notNull(),
  normalizedName: text('normalized_name').notNull().unique(),
  latitude: real('latitude'),
  longitude: real('longitude'),
  description: text('description'),
  country: text('country'),
  createdAt: text('created_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  bestTimeToVisit: text('best_time_to_visit'),
  averageTemperatureLow: text('average_temperature_low'),
  averageTemperatureHigh: text('average_temperature_high'),
  popularActivities: text('popular_activities'),
  travelTips: text('travel_tips'),
  nearbyAttractions: text('nearby_attractions'),
  transportationOptions: text('transportation_options'),
  accessibilityInfo: text('accessibility_info'),
  officialLanguage: text('official_language'),
  currency: text('currency'),
  localCuisine: text('local_cuisine'),
  costLevel: text('cost_level'),
  safetyRating: text('safety_rating'),
  culturalSignificance: text('cultural_significance'),
  userRatings: text('user_ratings'),
});
