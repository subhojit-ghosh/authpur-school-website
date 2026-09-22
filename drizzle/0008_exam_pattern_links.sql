-- Links to the new Examination Pattern page. The header menu and the footer
-- links are saved in site_settings once staff edit them, and a saved copy does
-- not pick up new defaults from the code, so the link is added here: under
-- Academics in the menu, and after School Timings in the footer's first
-- column. Nothing happens where a link to the page already exists.
UPDATE site_settings SET value = (
  SELECT jsonb_set(v, '{items}', (
    SELECT jsonb_agg(
      CASE WHEN item ->> 'label' = 'Academics'
        THEN jsonb_set(item, '{children}', (item -> 'children') ||
          '[{"label": "Examination Pattern", "href": "/examination-pattern", "desc": "Tests, marks & pass criteria"}]'::jsonb)
        ELSE item END
      ORDER BY ord)
    FROM jsonb_array_elements(v -> 'items') WITH ORDINALITY AS t(item, ord)
  ))
  FROM (SELECT value::jsonb AS v) AS s
)::text
WHERE key = 'navigation'
  AND value NOT LIKE '%/examination-pattern%'
  AND value::jsonb -> 'items' @> '[{"label": "Academics"}]'::jsonb;
--> statement-breakpoint
UPDATE site_settings SET value = (
  SELECT jsonb_set(v, '{footerExplore}', (
    SELECT jsonb_agg(e ORDER BY ord, sub)
    FROM jsonb_array_elements(v -> 'footerExplore') WITH ORDINALITY AS t(el, ord),
    LATERAL (VALUES
      (1, el),
      (2, CASE WHEN el ->> 'href' = '/school-timings'
        THEN '{"label": "Examination Pattern", "href": "/examination-pattern"}'::jsonb END)
    ) AS x(sub, e)
    WHERE e IS NOT NULL
  ))
  FROM (SELECT value::jsonb AS v) AS s
)::text
WHERE key = 'identity'
  AND value NOT LIKE '%/examination-pattern%'
  AND value::jsonb -> 'footerExplore' @> '[{"href": "/school-timings"}]'::jsonb;
