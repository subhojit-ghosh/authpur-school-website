-- The school is affiliated to the CISCE (ICSE at Class X, ISC at Class XII),
-- as its examination pattern sheets state. The site's original wording named
-- the West Bengal boards (WBBSE and WBCHSE) and the Madhyamik examination.
--
-- Wording that staff have saved lives in site_settings and overrides the
-- defaults in the code, so the defaults alone would not change the live site.
-- These replace only the exact sentences the site shipped with; anything staff
-- have already rewritten is left untouched. The footer line is replaced first
-- because it contains the shorter affiliation line.
UPDATE site_settings SET value = replace(value,
  'Affiliated to WBBSE & WBCHSE · Recognised by the Govt. of West Bengal',
  'Affiliated to the Council for the Indian School Certificate Examinations (CISCE), New Delhi')
WHERE key = 'identity';
--> statement-breakpoint
UPDATE site_settings SET value = replace(value,
  'Affiliated to WBBSE & WBCHSE',
  'Affiliated to CISCE (ICSE & ISC)')
WHERE key = 'identity';
--> statement-breakpoint
UPDATE site_settings SET value = replace(replace(value,
  'aligned to the WBBSE curriculum that prepares students for the Madhyamik examination',
  'following the ICSE curriculum that prepares students for the Class X ICSE examination'),
  'Specialised streams under WBCHSE guiding students',
  'Science, Commerce and Arts streams under the ISC curriculum, guiding students')
WHERE key = 'home_content';
--> statement-breakpoint
UPDATE site_settings SET value = replace(value,
  'Passed Class X (Madhyamik)',
  'Passed Class X (ICSE or equivalent)')
WHERE key = 'admissions';
--> statement-breakpoint
UPDATE notices SET title = replace(title, 'in WBCHSE examinations', 'in ISC examinations')
WHERE title LIKE '%in WBCHSE examinations%';
