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

## 4. Connect image storage (Vercel Blob)

Uploaded banners and gallery photos need permanent cloud storage.

1. Vercel project → **Storage** → **Create Database** → **Blob** → create and
   connect it to the project.
2. Vercel adds `BLOB_READ_WRITE_TOKEN` automatically; the panel detects it and
   switches uploads to Blob storage.
3. **Deployments → ⋯ → Redeploy** once so the new variable is picked up.

## 5. Create the staff login on the live database

Run once from the project folder on your computer, pasting the Neon
connection string and a strong password of the school's choice:

```bash
DATABASE_URL="postgres://…" ADMIN_PASSWORD="ChooseAStrongPassword1" npm run db:seed
```

Then load the starting notices, events and banners:

```bash
DATABASE_URL="postgres://…" npm run db:seed-content
```

If you were already using the panel locally and want that content (and your
current password) on the live site instead, copy it across:

```bash
DATABASE_URL="postgres://…" npm run db:copy-from-sqlite
```

Open `https://<your-address>/admin`, sign in as `admin`, and change the
password from **Account & Password** so only the school knows it.

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
| Staff login | `users` table; reset with `npm run db:seed` as in step 5 |

## Environment variables reference

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Production | Neon `postgres://…` connection string (pooled). Leave unset locally to use the embedded PGlite database in `data/pg`. |
| `BLOB_READ_WRITE_TOKEN` | Production | Set automatically by Vercel Blob; enables cloud image storage |
| `PGLITE_DIR` | No | Local embedded database folder (default `./data/pg`) |
| `UPLOADS_DIR` | No | Local image folder when Blob is not used (default `./data/uploads`) |

## Local development note

`npm run dev` starts a local Postgres (PGlite) on `127.0.0.1:54329` alongside
Next.js; the `db:*` scripts and `npm run build` connect to it while it runs.
With the dev server stopped, use `npm run build:local`, `npm run start:local`
or `npm run db:local`, which start that server for you. None of this applies
to Neon in production.
