CREATE TABLE IF NOT EXISTS "activities" (
	"activity_id" serial PRIMARY KEY NOT NULL,
	"activity_name" text,
	"description" text,
	"location" text,
	"latitude" numeric,
	"longitude" numeric,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"price" text,
	"location_id" integer,
	"duration" text,
	"difficulty" text,
	"category" text,
	"best_time" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "destinations" (
	"destination_id" serial PRIMARY KEY NOT NULL,
	"destination_name" text NOT NULL,
	"normalized_name" text NOT NULL,
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
	"user_ratings" text,
	CONSTRAINT "destinations_normalized_name_unique" UNIQUE("normalized_name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "itinerary_days" (
	"day_id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"trip_id" bigint,
	"day_number" bigint,
	"activity_id" bigint,
	"slot_number" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "saved_destinations" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"destination_id" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"notes" text,
	"is_visited" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "shared_trips" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"trip_id" serial NOT NULL,
	"share_code" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone,
	CONSTRAINT "shared_trips_share_code_unique" UNIQUE("share_code")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "trips" (
	"trip_id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"destination_id" bigint,
	"start_date" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"num_days" bigint,
	"title" text,
	"description" text,
	"status" text DEFAULT 'PLANNING' NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "saved_destinations" ADD CONSTRAINT "saved_destinations_destination_id_destinations_destination_id_fk" FOREIGN KEY ("destination_id") REFERENCES "public"."destinations"("destination_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "shared_trips" ADD CONSTRAINT "shared_trips_trip_id_trips_trip_id_fk" FOREIGN KEY ("trip_id") REFERENCES "public"."trips"("trip_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
