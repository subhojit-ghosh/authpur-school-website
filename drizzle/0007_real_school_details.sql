-- Replaces placeholder details the site shipped with by the school's real
-- ones, as published on its previous website (anms2u.com): phone, WhatsApp
-- number, email, CISCE affiliation code, social pages, headline figures and
-- testimonials.
--
-- Saved wording overrides the code defaults, so the live database needs the
-- same change. Every statement only fires while the value is still exactly
-- the placeholder; anything staff have already entered is left alone.
UPDATE site_settings SET value = replace(replace(replace(value,
  '+91 33 2588 0000', '+91 33 2581 4044'),
  '+91 98300 00000', '+91 82748 87550'),
  'office@authpurnationalmodel.edu.in', 'anms2u@gmail.com')
WHERE key = 'school_info';
--> statement-breakpoint
UPDATE site_settings SET value = replace(replace(value,
  'Affiliated to the Council for the Indian School Certificate Examinations (CISCE), New Delhi"',
  'Affiliated to the Council for the Indian School Certificate Examinations (CISCE), New Delhi. Affiliation code WB173."'),
  'Affiliated to CISCE (ICSE & ISC)"',
  'Affiliated to CISCE (ICSE & ISC), code WB173"')
WHERE key = 'identity';
--> statement-breakpoint
UPDATE site_settings
SET value = jsonb_set(value::jsonb, '{footerSocial}', '[
  {"icon": "facebook", "label": "Facebook", "href": "https://www.facebook.com/authpurnationalmodelschool/"},
  {"icon": "youtube", "label": "YouTube", "href": "https://www.youtube.com/channel/UCbMbdtNf7FgCOYCJI6qvaEg"},
  {"icon": "whatsapp", "label": "WhatsApp", "href": "https://wa.me/918274887550"}
]'::jsonb)::text
WHERE key = 'identity' AND coalesce(value::jsonb -> 'footerSocial', '[]'::jsonb) = '[]'::jsonb;
--> statement-breakpoint
UPDATE site_settings
SET value = jsonb_set(value::jsonb, '{stats}', '[
  {"value": "1982", "label": "Established", "hint": "Four decades of learning"},
  {"value": "2,200", "label": "Students", "hint": "Lower Nursery to Class XII"},
  {"value": "100", "label": "Teachers", "hint": "All certified"},
  {"value": "1,000+", "label": "Graduates", "hint": "And counting"}
]'::jsonb)::text
WHERE key = 'home_content' AND value::jsonb -> 'stats' = '[
  {"value": "1982", "label": "Established", "hint": "Four decades of learning"},
  {"value": "2,400+", "label": "Students", "hint": "Pre-primary to Class 12"},
  {"value": "95+", "label": "Faculty", "hint": "Qualified & caring"},
  {"value": "98%", "label": "Board Results", "hint": "Class 10 & 12 pass rate"}
]'::jsonb;
--> statement-breakpoint
UPDATE site_settings
SET value = jsonb_set(value::jsonb, '{testimonials,items}', '[
  {"quote": "My daughter studies at this school and she loves it here. It is a great school with caring, loving teachers and very supportive staff.", "name": "Debopriya Dey", "role": "Parent"},
  {"quote": "I studied here for two years, in Classes XI and XII. The school taught me not only academics but also the values of life, and I''m sure its lessons will help me through life.", "name": "Shounak Mallick", "role": "Student, Classes XI and XII"},
  {"quote": "The best place to study around Authpur. The teachers are cooperative, and their way of teaching is the best of any school in this locality.", "name": "Srijit Barui", "role": "Student"}
]'::jsonb)::text
WHERE key = 'home_content' AND value::jsonb -> 'testimonials' -> 'items' = '[
  {"quote": "The teachers here treat every child as their own. My daughter grew not just in marks, but in confidence and kindness.", "name": "Mrs. Ananya Sen", "role": "Parent, Class VIII"},
  {"quote": "From the science labs to the debate club, Authpur gave me the space to find what I love. I am now studying engineering.", "name": "Rohan Das", "role": "Alumnus, Batch of 2023"},
  {"quote": "A school that balances discipline with warmth. The values my son learned here will stay with him for life.", "name": "Mr. Sameer Chatterjee", "role": "Parent, Class XI"}
]'::jsonb;
