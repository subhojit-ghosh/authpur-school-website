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
account before first use:

```bash
cp .env.example .env.local   # DATABASE_URL defaults to a local SQLite file
npm run db:setup             # creates tables + the "admin" account (prints a temporary password)
npm run dev                  # then open http://localhost:3000/admin
```

Useful scripts:

| Script | What it does |
| --- | --- |
| `npm run db:migrate` | Apply pending SQL migrations from `drizzle/` |
| `npm run db:generate` | Generate a new migration after editing `src/db/schema.ts` |
| `npm run db:seed` | Create or reset the admin login (`ADMIN_USERNAME`, `ADMIN_PASSWORD` env vars optional) |
| `npm run db:studio` | Browse the database in Drizzle Studio |

For a hosted database (Turso / libSQL) set `DATABASE_URL=libsql://…` and
`DATABASE_AUTH_TOKEN` in the deployment environment; no code changes needed.

Uploaded banner and gallery photos are optimised with `sharp` (resized, WebP,
thumbnail) and stored under `data/uploads` (override with `UPLOADS_DIR`), served
at `/uploads/…` by `src/app/uploads/[...path]/route.ts`. `src/lib/storage.ts`
is the single place to swap in cloud storage.

Editable text content (contact details, timings, admission dates / fees /
eligibility) lives in the `site_settings` table and falls back to the values
in `src/lib/site.ts` until staff edit it.

## Documentation

| Document | Purpose |
| --- | --- |
| [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) | Step-by-step go-live on Vercel + Turso + Vercel Blob |
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
├── db/                     # Drizzle schema + libSQL client
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
