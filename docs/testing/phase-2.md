# Phase 2 — Notice Board, Events & Enquiry Inbox: how to test

**What was built:** the Notice Board manager (add, edit, delete, re-order,
date and category), the Events manager (add, edit, delete with date, title
and venue), the Enquiry Inbox (view, search, export to CSV, mark as read,
delete), and a live Dashboard. The public website now reads notices and
events from the database, and the Admission Enquiry form saves into the
inbox instead of opening an email app.

**Where:** run `npm run dev`, then open <http://localhost:3000/admin> and sign
in with the `admin` account and the password you set in Phase 1.

Have ready: about 30 minutes, and a second browser tab for the public site.

## A. Notice Board

| # | What to do | What you should see | Pass? |
| --- | --- | --- | --- |
| 2A.1 | Click **Notice Board** in the sidebar. | A table of the existing notices with Order arrows, Title, Category, Date and Edit / Delete icons. The top row's ↑ is greyed out. | ☐ |
| 2A.2 | Click **Add notice**. Leave the title empty and click **Publish notice**. | Red message under Title: *Please enter a title*. Nothing is saved. | ☐ |
| 2A.3 | Type title `TEST – Annual Sports Day`, keep today's date, choose category **Event**, click **Publish notice**. | You return to the list with a green *Saved… live on the website* banner. The new notice is the **first row**, tagged Event. | ☐ |
| 2A.4 | Open a new tab at <http://localhost:3000/>. | The notice scrolls in the gold **Latest Updates** ticker and is first in the **Notice Board** section. | ☐ |
| 2A.5 | In that tab open <http://localhost:3000/notices>. | The notice is first in **Latest Notices** with the Event pill and today's date. | ☐ |
| 2A.6 | Back in the panel click the **pencil** on the TEST row. Add ` 2026` to the title and click **Save changes**. | Green *Changes saved* banner; the title in the list now ends in 2026. Refresh the public Notices page: it shows the new title. | ☐ |
| 2A.7 | Click the **↓ arrow** on the TEST row. | It swaps places with the row below. Refresh the public home page: the Notice Board section shows the same new order. | ☐ |
| 2A.8 | Add two more notices with categories **Admissions** and **Result**, then one with **Notice**. | All four categories are selectable and each shows its own coloured pill on the website. | ☐ |
| 2A.9 | Click the **red bin** on a TEST notice. | A confirmation dialog appears. Press Cancel: nothing happens. Click again and press OK: green *Deleted* banner and the row is gone from the panel and the website. | ☐ |

## B. Events

| # | What to do | What you should see | Pass? |
| --- | --- | --- | --- |
| 2B.1 | Click **Events**. | A table with Date, Title, Venue, Status and actions. Events dated before today show a grey **Past** badge; future ones show green **On website**. | ☐ |
| 2B.2 | Click **Add event**. Fill title `TEST – Parent-Teacher Meeting`, a date next month, leave Venue empty, click **Publish event**. | Red message *Please enter the venue.* The title you typed is kept. | ☐ |
| 2B.3 | Enter venue `School Auditorium` and publish. | Green *Saved* banner; the event is in the list with status **On website**. | ☐ |
| 2B.4 | Refresh the public home page and the Notices page. | **Upcoming Events** shows a tile with the day and month, the title and *School Auditorium*. | ☐ |
| 2B.5 | Edit the event, change the venue to `Main Hall`, save. Refresh the public page. | The tile now shows *Main Hall*. | ☐ |
| 2B.6 | Add an event dated **yesterday**. | It appears in the panel with **Past** status but does **not** appear on the website. | ☐ |
| 2B.7 | Delete both TEST events (confirm each). | They disappear from the panel and the website. | ☐ |

## C. Enquiry Inbox

| # | What to do | What you should see | Pass? |
| --- | --- | --- | --- |
| 2C.1 | In the public tab open <http://localhost:3000/admission-enquiry>. Type a one-letter name and phone `12`, click **Send Enquiry**. | Red messages: *Please enter your full name* and *Please enter a valid phone number*. Nothing is sent. | ☐ |
| 2C.2 | Fill name `TEST Parent`, a real phone number, an email, class `Class VI` and a short message. Send. | A green **Thank you — we have received your enquiry** box replaces the form. | ☐ |
| 2C.3 | Scroll to the **Contact** section at the bottom of the home page and send a second enquiry as `TEST Home Form`. | Same thank-you box. | ☐ |
| 2C.4 | In the panel click **Enquiry Inbox**. | Both enquiries are listed, newest first, with a gold **New** badge, the received time, phone, email, class and message. The header reads *2 received in total, 2 new*. | ☐ |
| 2C.5 | Type `TEST Parent` in the search box and press **Search**. | Only that enquiry is shown, with *1 result for "TEST Parent"*. Click **Clear** to see all again. | ☐ |
| 2C.6 | Click **Export all (CSV)**. | A file named `admission-enquiries-<date>.csv` downloads. Open it in Excel or Numbers: one row per enquiry with Received, Name, Phone, Email, Class, Message and Status columns. | ☐ |
| 2C.7 | Click **Mark as read** on one enquiry. | The New badge and gold edge disappear; the button now says *Mark as new*; the header count of new enquiries drops by one. | ☐ |
| 2C.8 | Click **Mark all as read** (top right). | No enquiry shows New any more and the button disappears. | ☐ |
| 2C.9 | Click the **bin** on a TEST enquiry and confirm. | It is removed from the inbox. | ☐ |

## D. Dashboard

| # | What to do | What you should see | Pass? |
| --- | --- | --- | --- |
| 2D.1 | Click **Dashboard**. | The four cards show **real numbers**: notices on the board, upcoming events, new enquiries, banner images (still sample). Clicking a card opens that section. | ☐ |
| 2D.2 | Look at **Recent notices** and **Recent enquiries**. | They list the actual latest items; the *Sample* badges from Phase 1 are gone from these two panels. Notice titles link to their edit page. | ☐ |
| 2D.3 | Check the sidebar. | Notice Board, Events and Enquiry Inbox no longer carry a *Phase 2* tag. Hero Banner, Photo Gallery, Admissions Content and School Info still say *Phase 3*. | ☐ |

## E. Phone check

| # | What to do | What you should see | Pass? |
| --- | --- | --- | --- |
| 2E.1 | In the browser's mobile view (F12 → phone icon), open Notice Board, Enquiry Inbox and Add notice. | No sideways scrolling of the page. The notices table scrolls inside its own box. Forms and buttons are easy to tap. | ☐ |

**Phase 2 is accepted when** every row passes. Delete any remaining TEST
notices, events and enquiries afterwards so the public site is clean.

This is the **mid-project demonstration** milestone from the proposal: the
core modules (login, dashboard, notices, events, enquiries) are complete.

## Notes

- Only events dated today or later appear on the website. Past events stay
  in the panel so they can be edited and re-dated for next year.
- The sample events imported from the old site are all dated before today,
  so the public **Upcoming Events** box is empty until you add a future event.
- Changes made in the panel are published immediately. In production the
  public pages are also refreshed automatically at least once an hour.

## Report a problem

Say which row failed (e.g. "2C.6"), what you did, what you saw, and attach a
screenshot. Mention computer or phone, and which browser.
