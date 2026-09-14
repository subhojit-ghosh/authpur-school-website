import { defineConfig } from "drizzle-kit";

/**
 * Used by `drizzle-kit generate` to write SQL migrations into ./drizzle.
 * Migrations are applied by scripts/migrate.mjs (works for Neon and local PGlite).
 */
export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: { url: process.env.DATABASE_URL?.trim() || "postgres://localhost:5432/unused" },
  strict: false,
  verbose: true,
});
