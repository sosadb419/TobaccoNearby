-- REVIEWED MANUAL DATA CORRECTION - DO NOT RUN AUTOMATICALLY.
--
-- These five operator pages explicitly label staffed-shop opening hours separately
-- from forecourt/pump availability. Review the returned rows before committing in
-- production. No other gas-station records are changed by this script.

begin;

with verified_shop_hours(id, slug, source_url) as (
  values
    (
      '12b286d8-8dcf-4474-bc69-f2996933d039'::uuid,
      'shell-hansa-anthony-fokkerweg-8-1059cm',
      'https://find.shell.com/nl/fuel/12661638-shell-station-hansa/nl_NL'
    ),
    (
      '71dda6fa-5e05-4d92-9413-bd720e41c01e'::uuid,
      'shell-muntbergweg-20-1101ed',
      'https://find.shell.com/nl/fuel/10030460-shell-station-muntbergweg/nl_NL'
    ),
    (
      'a379eaa1-8e27-4d8a-8363-5c40f1035ba0'::uuid,
      'shell-maasboulevard-maasboulevard-10-3063nm',
      'https://find.shell.com/nl/fuel/10030452-shell-station-maasboulevard/nl_NL'
    ),
    (
      'c087289b-b308-4524-b8ff-87db23ee8cac'::uuid,
      'shell-maastunnel-s-gravendijkwal-175-3015gh',
      'https://find.shell.com/nl/fuel/13098023-shell-station-maastunnel/nl_NL'
    ),
    (
      'cea9673c-273b-44cb-91c5-564c8d2c780c'::uuid,
      'texaco-jacques-dutilhweg-851-3065jh',
      'https://texaco.nl/locatie/texaco-rotterdam-jac-dutilhweg/'
    )
)
update public.shops as shops
set
  opening_hours = jsonb_build_object(
    'monday', '00:00-23:59',
    'tuesday', '00:00-23:59',
    'wednesday', '00:00-23:59',
    'thursday', '00:00-23:59',
    'friday', '00:00-23:59',
    'saturday', '00:00-23:59',
    'sunday', '00:00-23:59',
    '_metadata', jsonb_build_object(
      'scope', 'shop',
      'shop_hours_verified', true,
      'source_url', verified_shop_hours.source_url,
      'checked_at', '2026-11-15'
    )
  ),
  source_url = verified_shop_hours.source_url,
  last_checked_at = date '2026-11-15',
  last_updated = date '2026-11-15'
from verified_shop_hours
where shops.id = verified_shop_hours.id
  and shops.slug = verified_shop_hours.slug
  and shops.place_type = 'gas_station'
  and shops.status = 'published'
returning shops.id, shops.name, shops.slug, shops.opening_hours, shops.source_url, shops.last_checked_at;

commit;
