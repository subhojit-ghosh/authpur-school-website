CREATE TABLE "audit_log" (
	"id" serial PRIMARY KEY NOT NULL,
	"at" text NOT NULL,
	"user_id" integer,
	"user_name" text NOT NULL,
	"action" text NOT NULL,
	"section" text NOT NULL,
	"summary" text NOT NULL,
	"details" text
);
--> statement-breakpoint
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;