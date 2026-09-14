# Deployment guide — taking the site and admin panel live

This puts the website and its admin panel on the internet with a stable
address, a cloud database and cloud image storage, as described in the
proposal's Technical Approach. Everything below uses free tiers that are
comfortably enough for a school website.

You will need about 30 minutes and access to three accounts you create
yourself: **GitHub** (code), **Vercel** (hosting) and **Turso** (database).
The developer cannot create these on your behalf.

## 1. Put the code on GitHub

1. Create a free account at <https://github.com> if you do not have one.
2. Create a new **private** repository, e.g. `authpur-school-website`. Do not
   add a README or .gitignore (the project already has them).
3. From the project folder on your computer, run (replace `YOUR-USER`):

```bash
git remote add origin https://github.com/YOUR-USER/authpur-school-website.git
```

```bash
git push -u origin main
```

Git will ask you to sign in to GitHub the first time.

## 2. Create the cloud database (Turso)

1. Sign up at <https://turso.tech> (GitHub sign-in is easiest).
2. Create a database, e.g. `authpur-school`, in a region near India
   (Singapore or Mumbai if offered).
3. On the database page, copy two values:
   - the **URL**, which looks like `libsql://authpur-school-YOUR-ORG.turso.io`
   - a **token** (click *Create token* → read & write, no expiry).

Keep both handy for step 3.

## 3. Deploy on Vercel

1. Sign up at <https://vercel.com> with your GitHub account.
2. Click **Add New → Project**, choose the `authpur-school-website`
   repository and click **Import**.
3. Before clicking Deploy, open **Environment Variables** and add:

| Name | Value |
| --- | --- |
| `DATABASE_URL` | the Turso URL from step 2 |
| `DATABASE_AUTH_TOKEN` | the Turso token from step 2 |

4. Click **Deploy**. The build runs the database migrations first, then
   builds the site. It takes 2–3 minutes. When it finishes you get an address
   like `https://authpur-school-website.vercel.app`.

## 4. Connect image storage (Vercel Blob)

Uploaded banners and gallery photos need permanent storage in the cloud.

1. In the Vercel project, open the **Storage** tab → **Create Database** →
   choose **Blob** → create it and connect it to the project.
2. Vercel adds a `BLOB_READ_WRITE_TOKEN` variable automatically. The panel
   detects it and switches uploads to Blob storage, no code change needed.
3. Redeploy once so the new variable is picked up: **Deployments → ⋯ →
   Redeploy**.

## 5. Create the staff login on the live database

Run this once from the project folder on your computer, using the Turso
values from step 2 and a strong password of the school's choice:

```bash
DATABASE_URL="libsql://…" DATABASE_AUTH_TOKEN="…" ADMIN_PASSWORD="ChooseAStrongPassword1" npm run db:seed
```

Then import the starting notices, events and banners:

```bash
DATABASE_URL="libsql://…" DATABASE_AUTH_TOKEN="…" npm run db:seed-content
```

Now open `https://<your-address>/admin`, sign in as `admin`, and change the
password from **Account & Password** so that only the school knows it.

## 6. Custom domain (optional, billed separately per the proposal)

In the Vercel project open **Settings → Domains**, add the school's domain
(e.g. `authpurnationalmodel.edu.in`) and follow the DNS instructions shown.
HTTPS is issued automatically.

## 7. Go-live checks

Work through `docs/testing/phase-4.md` on the live address. The key items:
the padlock in the address bar, signing in, adding and removing a notice,
uploading and removing a banner, and submitting the enquiry form.

## Updating the site later

Any change pushed to the `main` branch on GitHub is deployed automatically by
Vercel within a few minutes. Content changes made in the admin panel do not
need a deployment at all.

## Where things live

| Item | Place |
| --- | --- |
| Code | GitHub repository |
| Website + admin panel | Vercel project |
| Notices, events, enquiries, settings | Turso database |
| Uploaded images | Vercel Blob store |
| Staff login | `users` table in Turso; reset with `npm run db:seed` as in step 5 |

## Environment variables reference

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Yes | `libsql://…` for Turso, or `file:./data/school.db` locally |
| `DATABASE_AUTH_TOKEN` | Turso only | Database access token |
| `BLOB_READ_WRITE_TOKEN` | Production | Set automatically by Vercel Blob; enables cloud image storage |
| `UPLOADS_DIR` | No | Local image folder when Blob is not used (default `./data/uploads`) |
