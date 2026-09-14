# Phase 1 — Setup, Authentication & Dashboard: how to test

**What was built:** project setup on the existing Next.js site, a database
(SQLite locally, cloud-ready), a secure staff login with sessions, the admin
dashboard, the admin shell with links to every future section, and an
Account page where staff change their own password.

**Where:** run `npm run dev`, then open <http://localhost:3000/admin>.

**Login for testing:** username `admin`, password `anm-admin-2026`.
(Reset it any time with `ADMIN_PASSWORD=... npm run db:seed`.)

Have ready: a computer with a modern browser and a phone (or the browser's
mobile view: right-click → Inspect → toggle device toolbar).

| # | What to do | What you should see | Pass? |
| --- | --- | --- | --- |
| 1.1 | Open <http://localhost:3000/> and browse a few pages (Notices, Admissions, Gallery). | The public website looks and works exactly as before. | ☐ |
| 1.2 | Type <http://localhost:3000/admin> into the address bar (not signed in). | You are redirected to the **Staff sign in** page. No admin content is visible. | ☐ |
| 1.3 | Enter username `admin` and a wrong password, click **Sign in**. | Red message: *Incorrect username or password.* You stay on the login page. | ☐ |
| 1.4 | Using a made-up username such as `lockme`, enter a wrong password 5 times, then a 6th time. | The 6th attempt is refused with *Too many failed attempts. Please wait 15 minutes…* (Using a made-up name avoids locking `admin` while you test; restarting the dev server clears the lock.) | ☐ |
| 1.5 | Enter `admin` / `anm-admin-2026` and click **Sign in**. | You land on the **Dashboard**, greeted by name ("Good morning, School Office"). | ☐ |
| 1.6 | Look at the Dashboard. | Four stat cards, a **Recent notices** list (marked *Sample · live in Phase 2*), a **Recent enquiries** empty state, and **Quick links** to all 8 sections. | ☐ |
| 1.7 | Look at the colours, crest and fonts. | Navy sidebar, gold accents, the school crest and heading font — same family as the website. | ☐ |
| 1.8 | Press the browser **Refresh** button. | You stay signed in; the Dashboard reloads without asking for a password. | ☐ |
| 1.9 | Open a **second tab** and type `/admin`. | Dashboard opens directly (same session). | ☐ |
| 1.10 | Click a **Phase 2 / Phase 3** link (e.g. Notice Board). | A "Not built yet" page explaining what that section will do and which phase it arrives in, with a *Back to Dashboard* button. | ☐ |
| 1.11 | Click **Account & Password**. Type a wrong current password and a new password twice. | Red message: *The current password is incorrect.* | ☐ |
| 1.12 | Now type the correct current password and a new password (8+ characters, letters and numbers) twice. | Green message: *Password changed. Other devices have been signed out.* | ☐ |
| 1.13 | Click **Sign out** (top right, or the icon next to your name). | You return to the login page. Typing `/admin` again shows the login page, not the Dashboard. | ☐ |
| 1.14 | Sign in with the **old** password `anm-admin-2026`. | Rejected. | ☐ |
| 1.15 | Sign in with your **new** password. | Dashboard opens. | ☐ |
| 1.16 | While signed out, type `/admin/account` directly, then sign in. | After signing in you land on the **Account** page you asked for, not the Dashboard. | ☐ |
| 1.17 | Repeat 1.2, 1.5 and 1.6 on a **phone** (or mobile view). | Login card and Dashboard fit the screen with no sideways scrolling. A ☰ menu button opens the navigation drawer. | ☐ |
| 1.18 | Search-engine check: open <http://localhost:3000/robots.txt>. | It lists `Disallow: /admin`. | ☐ |

**Phase 1 is accepted when** every row passes on a computer and a phone.

> Note on https: the padlock / `https://` test only applies once the panel is
> deployed to its cloud address in Phase 4. Locally it is `http://localhost`.

**After testing** put the password back so the developer's notes stay valid,
or tell the developer the new one:

```bash
ADMIN_PASSWORD=anm-admin-2026 npm run db:seed
```

## Report a problem

Say which row failed (e.g. "1.12"), what you did, what you saw, and attach a
screenshot. Mention computer or phone, and which browser.
