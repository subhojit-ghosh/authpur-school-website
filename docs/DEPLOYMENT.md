# Deployment guide — taking the site and admin panel live

This puts the website and its admin panel on the internet with a stable
address, a cloud database and cloud image storage, as described in the
proposal's Technical Approach. Everything below uses free tiers that are
comfortably enough for a school website.

You need access to three accounts: **GitHub** (code), **Vercel** (hosting) and
**Neon** (PostgreSQL database). The developer cannot create or sign in to
these on your behalf.

## 1. Code on GitHub

The project is already pushed to `github.com/subhojit-ghosh/authpur-school-website`
and the Vercel project is connected to it, so every push to `main` deploys
automatically. For a fresh setup, create a private repository and run:

```bash
git remote add origin https://github.com/YOUR-USER/authpur-school-website.git
```

```bash
git push -u origin main
```

## 2. Create the database (Neon)

Either route works; the Vercel route is quicker because it fills in the
variable for you.

**Route A — from inside Vercel (recommended)**

1. Open the Vercel project → **Storage** tab → **Create Database** → choose
   **Neon** (Postgres) → pick a region near India (Singapore) → Create.
2. Connect it to the project for all environments. Vercel adds
   `DATABASE_URL` (and a few `POSTGRES_*` variables) automatically.

**Route B — from an existing Neon account**

1. Sign in at <https://console.neon.tech>, create a project, e.g.
   `authpur-school`, region Singapore.
2. On the project dashboard click **Connect**, tick **Pooled connection**, and
   copy the connection string. It looks like
   `postgres://user:password@ep-xxxx-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require`.
3. In Vercel → project → **Settings → Environment Variables**, add
   `DATABASE_URL` with that value for all environments.

## 3. Deploy on Vercel

If the project is already connected to GitHub, a push to `main` (or
**Deployments → ⋯ → Redeploy**) is enough. The build runs the database
migrations first, then builds the site; the log shows
`✓ Database is up to date`. First-time setup: **Add New → Project**, import
the repository, add `DATABASE_URL`, click **Deploy**.

Vercel picks the package manager from the lockfile in the repository. This
project commits `bun.lock`, so Vercel installs with Bun and runs the `build`
script with it — no build or install command needs to be set by hand. Keep
`bun.lock` committed; if it is ever deleted Vercel falls back to npm and the
build will fail on the missing `bun` in the `build` script.

## 4. Connect image storage (Vercel Blob)

Uploaded banners and gallery photos need permanent cloud storage.

1. Vercel project → **Storage** → **Create Database** → **Blob** → create and
   connect it to the project.
2. Vercel adds `BLOB_READ_WRITE_TOKEN` automatically; the panel detects it and
   switches uploads to Blob storage.
3. **Deployments → ⋯ → Redeploy** once so the new variable is picked up.

## 5. Create the staff login (no terminal needed)

The first deployment prints a **one-time setup code** in its build log and the
live site opens a one-time setup page for it.

1. In Vercel open **Deployments → the latest build → Build Logs** and look for
   the box headed `FIRST-TIME SETUP`. Copy the code, e.g. `KT4T-79L5-RCFM`.
2. Open `https://<your-address>/admin`. While no staff account exists you are
   taken to **/admin/setup**.
3. Enter the code, choose the username, the name shown in the panel and a
   password (8+ characters, letters and numbers), then create the account.
   You are signed in immediately.

The code stops working the moment the account is created, and the setup page
then redirects to the normal login screen.

The starting notices, events and hero banners are imported automatically
during the build, so the site is never empty.

**Alternative, from a terminal.** If you prefer, you can create the account
yourself with the Neon connection string:

```bash
DATABASE_URL="postgres://…" ADMIN_PASSWORD="ChooseAStrongPassword1" bun run db:seed
```

If you were already using the panel locally and want that content on the live
site, copy it across (the old SQLite file must still be present):

```bash
DATABASE_URL="postgres://…" bun run db:copy-from-sqlite
```

## 6. Custom domain (optional, billed separately per the proposal)

Vercel project → **Settings → Domains** → add the school's domain and follow
the DNS instructions. HTTPS is issued automatically.

## 7. Go-live checks

Work through `docs/testing/phase-4.md` section B on the live address.

## Updating the site later

Any push to `main` is deployed automatically within a few minutes. Content
changes made in the admin panel never need a deployment.

## Where things live

| Item | Place |
| --- | --- |
| Code | GitHub repository |
| Website + admin panel | Vercel project |
| Notices, events, enquiries, settings, users | Neon PostgreSQL |
| Uploaded images | Vercel Blob store |
| Staff login | `users` table; created via /admin/setup, or reset with `bun run db:seed` |

## Environment variables reference

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Production | Neon `postgres://…` connection string (pooled). Leave unset locally to use the embedded PGlite database in `data/pg`. |
| `BLOB_READ_WRITE_TOKEN` | Production | Set automatically by Vercel Blob; enables cloud image storage |
| `PGLITE_DIR` | No | Local embedded database folder (default `./data/pg`) |
| `UPLOADS_DIR` | No | Local image folder when Blob is not used (default `./data/uploads`) |

## Local development note

`bun run dev` starts a local Postgres (PGlite) on `127.0.0.1:54329` alongside
Next.js; the `db:*` scripts and `bun run build` connect to it while it runs.
With the dev server stopped, use `bun run build:local`, `bun run start:local`
or `bun run db:local`, which start that server for you. None of this applies
to Neon in production.
