CREATE TABLE "uploaded_files" (
	"key" text PRIMARY KEY NOT NULL,
	"content_type" text NOT NULL,
	"data" "bytea" NOT NULL,
	"size" integer NOT NULL,
	"created_at" text DEFAULT now()::text NOT NULL
);
