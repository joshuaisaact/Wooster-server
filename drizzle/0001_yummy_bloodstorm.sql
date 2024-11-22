CREATE TABLE `activities` (
	`activity_id` integer  AUTOINCREMENT,
	`activity_name` text,
	`description` text,
	`location` text,
	`latitude` real,
	`longitude` real,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`price` text,
	`location_id` integer,
	`duration` text,
	`difficulty` text,
	`category` text,
	`best_time` text
);
--> statement-breakpoint
CREATE TABLE `destinations` (
	`destination_id` integer AUTOINCREMENT,
	`destination_name` text,
	`normalized_name` text,
	`latitude` real,
	`longitude` real,
	`description` text,
	`country` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`best_time_to_visit` text,
	`average_temperature_low` text,
	`average_temperature_high` text,
	`popular_activities` text,
	`travel_tips` text,
	`nearby_attractions` text,
	`transportation_options` text,
	`accessibility_info` text,
	`official_language` text,
	`currency` text,
	`local_cuisine` text,
	`cost_level` text,
	`safety_rating` text,
	`cultural_significance` text,
	`user_ratings` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `destinations_normalized_name_unique` ON `destinations` (`normalized_name`);--> statement-breakpoint
CREATE TABLE `itinerary_days` (
	`day_id` integer AUTOINCREMENT,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`trip_id` integer,
	`day_number` integer,
	`activity_id` integer
);
--> statement-breakpoint
CREATE TABLE `saved_destinations` (
	`id` integer AUTOINCREMENT,
	`user_id` text,
	`destination_id` integer,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`notes` text,
	`is_visited` integer DEFAULT false,
	FOREIGN KEY (`destination_id`) REFERENCES `destinations`(`destination_id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `trips` (
	`trip_id` integer AUTOINCREMENT,
	`user_id` text,
	`destination_id` integer,
	`start_date` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`num_days` integer
);
