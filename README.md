# Authpur National Model Higher Secondary School — Website

Marketing website for **Authpur National Model Higher Secondary School**, Ghosh Para Road, Authpur, Shyamnagar, West Bengal 743128.

Built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS v4** and **shadcn/ui**.

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

```bash
npm run build    # production build
npm run start    # serve the production build
```

## Admin panel (local setup)

The staff admin panel lives at `/admin`. It needs a database and one staff
account before first use. Locally an embedded PostgreSQL (PGlite) is used
automatically — nothing to install:

```bash
cp .env.example .env.local   # optional; defaults work as-is
npm run db:setup             # creates tables + the "admin" account (prints a temporary password) + starter content
npm run dev                  # then open http://localhost:3000/admin
```

Useful scripts:

| Script | What it does |
| --- | --- |
| `npm run db:migrate` | Apply pending SQL migrations from `drizzle/` |
| `npm run db:generate` | Generate a new migration after editing `src/db/schema.ts` |
| `npm run db:seed` | Create or reset the admin login (`ADMIN_USERNAME`, `ADMIN_PASSWORD` env vars optional) |
| `npm run db:seed-content` | Import the starter notices, events and banners if the tables are empty |
| `npm run db:copy-from-sqlite` | One-off: copy data from the old `data/school.db` SQLite file |
| `npm run db:local` | Run the local database server alone (for scripts when the dev server is stopped) |
| `npm run build:local` / `start:local` | Production build / serve on port 3001 with the local database server |

`npm run dev` also starts the local database server (PGlite on
`127.0.0.1:54329`) and the `db:*` scripts connect through it, so they can run
while the dev server is up. When the dev server is **not** running, use
`npm run build:local` / `npm run start:local` (they start the database server
for you), or `npm run db:local` to run it on its own.

In production set `DATABASE_URL` to a Neon PostgreSQL connection string; the
same code and migrations run unchanged. See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

Uploaded banner and gallery photos are optimised with `sharp` (resized, WebP,
thumbnail) and stored under `data/uploads` locally or in Vercel Blob in
production (`src/lib/storage.ts` picks the driver from `BLOB_READ_WRITE_TOKEN`).

Editable text content (contact details, timings, admission dates / fees /
eligibility) lives in the `site_settings` table and falls back to the values
in `src/lib/site.ts` until staff edit it.

## Documentation

| Document | Purpose |
| --- | --- |
| [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) | Step-by-step go-live on Vercel + Neon Postgres + Vercel Blob |
| [docs/USER-GUIDE.md](docs/USER-GUIDE.md) / `docs/Admin-Panel-User-Guide.docx` | Staff user guide for the admin panel |
| [docs/testing/](docs/testing/) | Acceptance checklists for each delivery phase |

## Project structure

```
src/
├── app/
│   ├── layout.tsx          # Fonts, metadata, <body> shell
│   ├── (site)/             # Public website — layout adds header + footer
│   │   ├── page.tsx        # Home page — composes all sections
│   │   └── <route>/        # Interior pages (admissions, gallery, notices, …)
│   ├── admin/              # Staff admin panel (login + protected (panel) group)
│   ├── robots.ts           # Disallows /admin for search engines
│   └── globals.css         # Design tokens (navy + gold palette), utilities
├── proxy.ts                # Redirects signed-out visitors away from /admin
├── db/                     # Drizzle schema + Postgres client (Neon / PGlite)
├── components/
│   ├── crest.tsx           # SVG school crest
│   ├── site-header.tsx     # Sticky nav + announcement bar + mobile menu
│   ├── site-footer.tsx     # Footer with links & contact
│   ├── admin/              # Admin shell, page header, placeholders
│   ├── sections/           # Home page sections (hero, about, academics, …)
│   └── ui/                 # shadcn/ui primitives
└── lib/
    ├── site.ts             # Single source of truth for all school content
    ├── auth.ts             # Sessions, login, sign-out (server only)
    ├── password.ts         # scrypt password hashing
    ├── admin-nav.ts        # Admin sections + which phase each goes live
    └── utils.ts            # cn() helper
```

## Editing content

Almost all copy — school details, stats, programmes, features, notices,
events, testimonials — lives in [`src/lib/site.ts`](src/lib/site.ts). Update
values there and every section reflects the change.

## Design system

- **Palette:** scholarly navy (`--brand`) + warm gold (`--gold`) on a soft
  ivory background. Defined as CSS variables in `globals.css`.
- **Type:** _Fraunces_ (serif) for headings, _Inter_ for body/UI.
- **Theming:** shadcn/ui tokens are mapped to the brand palette; a dark theme
  is also defined but not toggled by default.

## Notes / next steps

- The gallery and hero use styled placeholders — drop in real campus
  photographs (e.g. via `next/image`) when available.
- The enquiry form opens the visitor's email client with details pre-filled.
  Wire it to a backend / form service for direct submissions.
- Interior pages (About, Academics, Admissions, Contact) can be added under
  `src/app/<route>/page.tsx`; the header/footer already wrap every route.
