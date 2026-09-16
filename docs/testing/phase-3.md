# Phase 3 — Hero Banner, Photo Gallery, Admissions Content & School Info: how to test

**What was built:** the Hero Banner manager (upload, re-order, describe,
remove), the Photo Gallery manager (upload, categorise, caption, delete),
the Admissions Content editor (dates, eligibility, fees, note) and School
Info settings (phone numbers, email, address, office hours, daily schedule,
section timings). Uploaded photos are checked, rotated correctly, resized
and converted to WebP automatically, with a thumbnail.

**Where:** run `bun run dev`, then open <http://localhost:3000/admin> and sign
in with the `admin` account.

Have ready: 3–4 landscape photos (JPG/PNG/HEIC), one very large photo straight
from a phone, a PDF or Word file, and a second browser tab for the public site.

## A. Hero Banner

| # | What to do | What you should see | Pass? |
| --- | --- | --- | --- |
| 3A.1 | Click **Hero Banner**. | The 5 original banner photos, numbered 1–5 and tagged *Original*, each with a description box, ↑ ↓ arrows and a Remove button. | ☐ |
| 3A.2 | Click the dashed **upload box** and choose one landscape photo (or drag it onto the box). | The file name appears below with *Uploading…* then *Uploaded & optimised*. A new card appears as number 6 with a thumbnail and its size, e.g. *1920 × 1080*. | ☐ |
| 3A.3 | Open the public tab at <http://localhost:3000/> and wait for the carousel to rotate (or click the dots). | Your photo is the 6th slide, full width and sharp. | ☐ |
| 3A.4 | Upload the **very large phone photo**. | It uploads within about a minute and its card shows a width of at most 1920 px: it was optimised. The home page loads quickly. | ☐ |
| 3A.5 | Try to upload the **PDF or Word file**. | Red message: *Only image files (JPG, PNG, WebP or HEIC) can be uploaded.* No card is added. | ☐ |
| 3A.6 | Click the **↑ arrow** on your photo's card. | It swaps with the card before it. Refresh the home page: the slide order matches. | ☐ |
| 3A.7 | Type a short description in the box under your photo and click the **save icon**. | The text stays after the page refreshes. | ☐ |
| 3A.8 | Click **Remove** on one of your uploads and confirm. | The card disappears and the slide is gone from the home page. | ☐ |

## B. Photo Gallery

| # | What to do | What you should see | Pass? |
| --- | --- | --- | --- |
| 3B.1 | Click **Photo Gallery**. | An upload box with a **Category for new photos** dropdown, filter pills (All, Campus, Academics, Sports, Events) and *No photos yet*. | ☐ |
| 3B.2 | Choose category **Sports** and upload one photo. | A card appears with the thumbnail, an empty caption box and the category set to Sports. The header says *1 photo on the website's Gallery page*. | ☐ |
| 3B.3 | Open the public tab at <http://localhost:3000/gallery>. | The placeholder tiles are gone. Your photo shows with a *Sports* pill. Clicking the **Academics** filter shows *No photos in this category yet*; **Sports** shows your photo. | ☐ |
| 3B.4 | Upload one photo in each of Campus, Academics and Events (you can select several files at once). | All four categories are available; each photo shows under the right filter on the public page. | ☐ |
| 3B.5 | On one card, type a caption, change the category dropdown, and click the **save icon**. | After refresh the caption and category are kept; on the public page the caption appears over the photo under the new category. | ☐ |
| 3B.6 | Click the admin filter pills (e.g. **Events**). | The list shows only that category and the upload dropdown pre-selects it. | ☐ |
| 3B.7 | Click the **bin** on a photo and confirm. | It disappears from the panel and the public gallery. | ☐ |

## C. Admissions Content

| # | What to do | What you should see | Pass? |
| --- | --- | --- | --- |
| 3C.1 | Open the public **Admissions** page (<http://localhost:3000/admissions>) and note the Important dates, Eligibility and Fee structure. | You have the current values to compare against. | ☐ |
| 3C.2 | In the panel click **Admissions Content**. | Three editable tables (dates, eligibility, fees) pre-filled with the same values, plus the fee note. Each row has ↑ ↓ and a bin; each table has an **Add** button. | ☐ |
| 3C.3 | Change *Last date to apply* to a new date and click **Save & publish**. | Green *Saved* message. Refresh the public Admissions page: the new date shows. | ☐ |
| 3C.4 | Add a fee row with only the fee head filled in (leave the amount empty) and save. | Red message: *Every row needs both fields filled in.* Nothing is saved. | ☐ |
| 3C.5 | Fill in the amount (e.g. `₹250`) and save. Refresh the public page. | The new fee row appears at the bottom of the fee table. | ☐ |
| 3C.6 | Use ↑ to move the new fee to the top, edit the eligibility text for Class I, edit the fee note, save. Refresh. | The order, eligibility text and note all match on the public page. | ☐ |
| 3C.7 | Remove the test fee row with the bin, restore the original date, save. | The public page matches what you noted in 3C.1. | ☐ |

## D. School Info

| # | What to do | What you should see | Pass? |
| --- | --- | --- | --- |
| 3D.1 | Click **School Info**. | Two forms: *Contact details & address* (phone, helpline, email, address, PIN, office hours) and *School timings* (daily schedule, section hours, note). | ☐ |
| 3D.2 | Change the last digit of the **School office phone** and click **Save contact details**. | Green message. Open the public home page: the number in the **top bar**, the **footer** and the **Contact** section all show the new digit. | ☐ |
| 3D.3 | Change the **email** and **Address line 1**, save. | Footer and Contact section show them. The Admission Enquiry page shows the new email. | ☐ |
| 3D.4 | Change the **Admissions helpline**, save. Open the public Admissions page and the Admission Enquiry page. | Both show the new helpline, including the *Call* button and the text under the enquiry form. | ☐ |
| 3D.5 | Type letters into the **PIN code** and save. | Red message: *PIN code must be 6 digits.* Nothing saved. Put the real PIN back. | ☐ |
| 3D.6 | Change **Office hours**, save. | The new hours show in the footer, the Contact section, the Admission Enquiry page and the School Timings page. | ☐ |
| 3D.7 | In *School timings* change *Morning assembly* to a new time and add a section row, then **Save timings**. Open <http://localhost:3000/school-timings>. | The new time and the extra section row are shown. | ☐ |
| 3D.8 | Restore all original values and save both forms. | Public pages show the original details. | ☐ |

## E. Dashboard & phone

| # | What to do | What you should see | Pass? |
| --- | --- | --- | --- |
| 3E.1 | Click **Dashboard**. | *Banner images* shows the real count plus *+ N gallery photos*. No *Phase 3* tags remain anywhere; every quick link opens a working section. | ☐ |
| 3E.2 | In the browser's mobile view, open Hero Banner and School Info, and upload one photo from the phone view. | No sideways scrolling; the upload box and forms are usable. | ☐ |

**Phase 3 is accepted when** every row passes. Remove any TEST photos and
restore the original text afterwards.

## Notes

- Uploaded images are stored in the project's `data/uploads` folder and
  served at `/uploads/…`. The cloud deployment in Phase 4 will point this at
  cloud storage without any change to the panel.
- The 5 original banners are the site's built-in photos. They can be removed
  or re-ordered like any other; removing all of them makes the home page fall
  back to the built-in set until a new one is uploaded.
- Until the first gallery photo is uploaded, the public Gallery page shows the
  styled placeholder tiles.

## Report a problem

Say which row failed (e.g. "3B.5"), what you did, what you saw, and attach a
screenshot. Mention computer or phone, and which browser.
