CREATE TABLE IF NOT EXISTS "activities" (
	"activity_id" serial PRIMARY KEY NOT NULL,
	"activity_name" text,
	"description" text,
	"location" text,
	"latitude" numeric,
	"longitude" numeric,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"price" text,
	"location_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "destinations" (
	"destination_id" serial PRIMARY KEY NOT NULL,
	"destination_name" text NOT NULL,
	"latitude" numeric,
	"longitude" numeric,
	"description" text,
	"country" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"best_time_to_visit" varchar,
	"average_temperature_low" text,
	"average_temperature_high" text,
	"popular_activities" text,
	"travel_tips" text,
	"nearby_attractions" text,
	"transportation_options" text,
	"accessibility_info" text,
	"official_language" varchar,
	"currency" varchar,
	"local_cuisine" text,
	"cost_level" varchar,
	"safety_rating" text,
	"cultural_significance" text,
	"user_ratings" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "itinerary_days" (
	"day_id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"trip_id" bigint,
	"day_number" bigint,
	"activity_id" bigint
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "trips" (
	"trip_id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"destination_id" bigint,
	"start_date" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"num_days" bigint
);
