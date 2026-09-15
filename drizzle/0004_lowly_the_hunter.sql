ALTER TABLE "events" ADD COLUMN "active" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "notices" ADD COLUMN "active" boolean DEFAULT true NOT NULL;