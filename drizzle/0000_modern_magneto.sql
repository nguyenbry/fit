CREATE TABLE IF NOT EXISTS "gyms" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"uid" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "gyms_name_uid_key" UNIQUE("name","uid")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "movements" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"verified" boolean DEFAULT false NOT NULL,
	"type" "workout_type",
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "movements_name_key" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone,
	"first" text,
	"last" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "target_movement" (
	"target" integer NOT NULL,
	"movement" integer NOT NULL,
	"verified" boolean DEFAULT false NOT NULL,
	CONSTRAINT tag_associations_pkey PRIMARY KEY("target","movement")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "targets" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"verified" boolean DEFAULT false NOT NULL,
	CONSTRAINT "tags_name_key" UNIQUE("name")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "gyms" ADD CONSTRAINT "gyms_uid_users_id_fk" FOREIGN KEY ("uid") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "target_movement" ADD CONSTRAINT "target_movement_target_targets_id_fk" FOREIGN KEY ("target") REFERENCES "targets"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "target_movement" ADD CONSTRAINT "target_movement_movement_movements_id_fk" FOREIGN KEY ("movement") REFERENCES "movements"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
