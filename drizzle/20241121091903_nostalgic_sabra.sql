CREATE TABLE IF NOT EXISTS "activities" (
	"activity_id" serial,
	"activity_name" text,
	"description" text,
	"location" text,
	"latitude" numeric,
	"longitude" numeric,
	"created_at" timestamp with time zone DEFAULT now(),
	"price" text,
	"location_id" integer,
	"duration" text,
	"difficulty" text,
	"category" text,
	"best_time" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "destinations" (
	"destination_id" serial,
	"destination_name" text,
	"normalized_name" text,
	"latitude" numeric,
	"longitude" numeric,
	"description" text,
	"country" text,
	"created_at" timestamp with time zone DEFAULT now(),
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
	"user_ratings" text,
	CONSTRAINT "destinations_normalized_name_unique" UNIQUE("normalized_name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "itinerary_days" (
	"day_id" serial,
	"created_at" timestamp with time zone DEFAULT now(),
	"trip_id" bigint,
	"day_number" bigint,
	"activity_id" bigint
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "saved_destinations" (
	"id" serial,
	"user_id" uuid,
	"destination_id" integer,
	"created_at" timestamp with time zone DEFAULT now(),
	"notes" text,
	"is_visited" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "trips" (
	"trip_id" serial,
	"user_id" uuid,
	"destination_id" bigint,
	"start_date" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now(),
	"num_days" bigint
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "saved_destinations" ADD CONSTRAINT "saved_destinations_destination_id_destinations_destination_id_fk" FOREIGN KEY ("destination_id") REFERENCES "public"."destinations"("destination_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
