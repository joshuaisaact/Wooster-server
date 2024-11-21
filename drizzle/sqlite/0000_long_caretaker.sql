CREATE TABLE `activities` (
	`activity_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`activity_name` text,
	`description` text,
	`location` text,
	`latitude` real,
	`longitude` real,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`price` text,
	`location_id` integer,
	`duration` text,
	`difficulty` text,
	`category` text,
	`best_time` text
);
--> statement-breakpoint
CREATE TABLE `destinations` (
	`destination_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`destination_name` text NOT NULL,
	`normalized_name` text NOT NULL,
	`latitude` real,
	`longitude` real,
	`description` text,
	`country` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
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
	`day_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`trip_id` integer,
	`day_number` integer,
	`activity_id` integer
);
--> statement-breakpoint
CREATE TABLE `saved_destinations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`destination_id` integer NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`notes` text,
	`is_visited` integer DEFAULT false,
	FOREIGN KEY (`destination_id`) REFERENCES `destinations`(`destination_id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `trips` (
	`trip_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`destination_id` integer,
	`start_date` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`num_days` integer
);
