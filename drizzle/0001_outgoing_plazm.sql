ALTER TABLE "gyms" DROP CONSTRAINT "gyms_uid_fkey";
--> statement-breakpoint
ALTER TABLE "gyms" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "gyms" ADD CONSTRAINT "gyms_uid_users_id_fk" FOREIGN KEY ("uid") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
