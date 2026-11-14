-- Read-only audit: identify published gas-station records whose opening hours
-- may describe fuel-pump availability rather than physical shop hours.
-- This query does not update or delete any data.

select
  id,
  name,
  slug,
  address,
  postal_code,
  city,
  neighborhood,
  opening_hours,
  verified,
  last_checked_at,
  source_url,
  updated_at
from public.shops
where status = 'published'
  and place_type = 'gas_station'
  and opening_hours is not null
  and (
    opening_hours::text ~* '00:00.{0,120}23:5[89]'
    or opening_hours::text ~* '24\s*/\s*7'
    or opening_hours::text ~* '24\s*(hours?|uur)'
  )
order by city, name;
