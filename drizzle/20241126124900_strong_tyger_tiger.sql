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
DO $$ BEGIN
 ALTER TABLE "shared_trips" ADD CONSTRAINT "shared_trips_trip_id_trips_trip_id_fk" FOREIGN KEY ("trip_id") REFERENCES "public"."trips"("trip_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
