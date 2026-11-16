-- Reviewed motorway-only access updates, 2026-11-16.
--
-- No published listing met the strict confirmation threshold during this
-- review. This file intentionally contains no UPDATE statement. Do not mark a
-- listing TRUE merely because it is a gas station or close to a motorway.
-- See docs/motorway-only-access-audit-2026-11-16.md for the evidence review.

select id, slug, name, address, motorway_only_access
from public.shops
where motorway_only_access = true
order by city, name;
