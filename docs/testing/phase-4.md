# Phase 4 — Testing, Deployment & Training: how to test

**What this phase delivers:** a full quality pass over Phases 1–3, one round
of revisions, go-live on a cloud address, a handover session, and a short
user guide.

**Prepared so far (before the school's accounts exist):**

- Cloud image storage driver (Vercel Blob), switched on automatically in production.
- Database migrations run automatically as part of every deployment build.
- Security headers on every response.
- `docs/DEPLOYMENT.md` — step-by-step go-live instructions.
- `docs/USER-GUIDE.md` and `docs/Admin-Panel-User-Guide.docx` — the staff user guide.
- A production-build regression run by the developer (see the report in chat).

## A. Revisions

| # | What to do | What you should see | Pass? |
| --- | --- | --- | --- |
| 4A.1 | Go through the list of anything you reported during Phase 1–3 testing. | Each item is marked fixed, or has an agreed explanation. | ☐ |
| 4A.2 | Re-run the specific rows that failed earlier. | They now pass. | ☐ |

## B. Deployment (needs the school's GitHub, Vercel and Neon accounts)

Follow `docs/DEPLOYMENT.md`, then:

| # | What to do | What you should see | Pass? |
| --- | --- | --- | --- |
| 4B.1 | Open the live address in a browser. | The public website loads over **https://** with a padlock. | ☐ |
| 4B.2 | Open the live address followed by `/admin` and sign in. | The login page and Dashboard work exactly as on localhost. | ☐ |
| 4B.3 | Add a notice, then check the live home page and Notices page. Delete it. | The notice appears and disappears on the live site. | ☐ |
| 4B.4 | Upload a banner photo, check the live home page, then remove it. | The slide appears, is served from the cloud storage address, and disappears when removed. | ☐ |
| 4B.5 | Submit the enquiry form on the live site, then open the Enquiry Inbox. | The enquiry is there. Delete it. | ☐ |
| 4B.6 | Change the office hours in School Info and check the live footer. Restore it. | The live site updates within a few seconds. | ☐ |
| 4B.7 | Open the live address on a **phone** (real device, mobile data). | Site and admin panel both work; no sideways scrolling. | ☐ |
| 4B.8 | Sign out, then open `/admin` again. | Login page. Direct links to admin pages redirect to login. | ☐ |

## C. Local production-build regression (already run by the developer)

| # | What to do | What you should see | Pass? |
| --- | --- | --- | --- |
| 4C.1 | `npm run build:local` then `npm run start:local` (or `npm run build` + `npx next start -p 3001` while `npm run dev` is running). | Build completes; migrations run first; site serves on port 3001. | ☐ |
| 4C.2 | Visit every public page and admin page on the production server. | All return 200 (admin pages redirect to login when signed out). | ☐ |
| 4C.3 | Check `robots.txt`, a missing upload URL, and the response headers. | `Disallow: /admin`; 404 for a missing upload; security headers present. | ☐ |

## D. Training & handover

| # | What to do | What you should see | Pass? |
| --- | --- | --- | --- |
| 4D.1 | Attend the handover session. | Every module demonstrated; staff practise adding a notice, an event, a banner and a gallery photo themselves. | ☐ |
| 4D.2 | Receive the user guide (`docs/Admin-Panel-User-Guide.docx`). | It covers signing in, every module, good habits and troubleshooting, and matches the panel. | ☐ |
| 4D.3 | Ask a colleague who has not seen the panel to add a notice using only the guide. | They succeed without help. | ☐ |
| 4D.4 | Confirm the school has set its own admin password. | The developer's temporary password no longer works. | ☐ |
| 4D.5 | Confirm what happens after handover. | Ongoing maintenance is a separate Annual Maintenance Contract. | ☐ |

**Phase 4 is accepted when** every row passes and the site is live at its
final address. The final 30% payment falls due at this point.
