import { defineConfig } from "drizzle-kit";

const url = process.env.DATABASE_URL?.trim() || "file:./data/school.db";
const authToken = process.env.DATABASE_AUTH_TOKEN?.trim() || undefined;

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: url.startsWith("file:") ? "sqlite" : "turso",
  dbCredentials: url.startsWith("file:") ? { url } : { url, authToken },
  strict: false,
  verbose: true,
});
