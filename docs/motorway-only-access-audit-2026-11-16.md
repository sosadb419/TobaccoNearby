# Motorway-only access audit — 2026-11-16

## Scope and decision rule

The review covered the 284 published listings exposed by TobaccoNearby on 2026-11-16. The full dataset was screened by name, address, city and coordinates for motorway/service-area signals. Suspected records were then checked against their exact OpenStreetMap location, road access tags and pedestrian/bicycle routing. A listing is eligible for `motorway_only_access = true` only when there is strong, location-specific evidence that no lawful, practical pedestrian, bicycle or normal local-road entrance exists.

Being a petrol station, being close to an A-road, or requiring a long route is not sufficient. Uncertain records remain `false` and visible.

## Outcome

### A. Confirmed motorway-only

None. No production record met the strict confirmation threshold. The reviewed SQL therefore contains no `UPDATE` statement.

### B. Accessible

| Shop | ID / slug | Evidence | Decision |
| --- | --- | --- | --- |
| TotalEnergies Ganzenhoef, Gooiseweg 51, Amsterdam | `c83b4a54-66a3-43a2-9644-eb381f41a93f` / `totalenergies-ganzenhoef-gooiseweg-51-1103bz` | The exact [OSM fuel node](https://www.openstreetmap.org/node/251319863) is beside Gooiseweg S112, whose main carriageway is tagged `foot=no` and `bicycle=no`, but the surrounding map contains separate local foot/cycle infrastructure including [Ganzenhoefpad](https://www.openstreetmap.org/way/1378423771). Pedestrian and bicycle route checks reached the exact node without using the restricted carriageway. | Accessible; keep `false`. |
| TotalEnergies Flierbos, Gooiseweg 50, Amsterdam | `80ee5308-cec9-458b-8a7c-ca334776c12b` / `totalenergies-flierbos-gooiseweg-50-1102bz` | The exact [OSM fuel node](https://www.openstreetmap.org/node/251319857) is served by local paths, including [Kraaiennestpad](https://www.openstreetmap.org/way/1379398908) and the Kelbergen local network. Pedestrian and bicycle routing reached the station without requiring motorway-only infrastructure. | Accessible; keep `false`. |
| Tango Europoort, Rijksweg A15 200, Rotterdam | `7fbda3f8-1d56-4649-9d0e-745dfa5a915c` / `tango-europoort-rijksweg-a15-200-3198ld` | The address and a 150 m motorway-proximity screen triggered review. The exact [OSM fuel node](https://www.openstreetmap.org/node/2768145541) is near the A15, but pedestrian and bicycle routing both reached it through the local network and [Hartelpad](https://www.openstreetmap.org/way/7562277). | Accessible; keep `false`. |
| OK, Vondelingenweg 496, Rotterdam | `9096023f-8df1-4c0d-830a-7daa360db750` / `ok-vondelingenweg-496-3194aj` | A 150 m motorway-proximity screen triggered review. The exact [OSM fuel node](https://www.openstreetmap.org/node/2780409287) has a local Vondelingenweg/S101 approach. Independent pedestrian and bicycle route checks both reached the destination without a motorway segment. | Accessible; keep `false`. |

OpenStreetMap data is © OpenStreetMap contributors and was checked through the OSM API/Nominatim and the public OSM Valhalla routing service on 2026-11-16.

### C. Unverified / no conclusive restriction evidence

The remaining 280 published records were not shown by the dataset screen to have enough evidence for a motorway-only classification. They remain at the safe default `false`. This group includes ordinary urban listings and records where access was not individually proven either way; it must not be interpreted as a positive accessibility guarantee.

The exact current group can be reviewed in Supabase without changing data:

```sql
select id, slug, name, address, postal_code, city, latitude, longitude
from public.shops
where status = 'published'
  and slug not in (
    'totalenergies-ganzenhoef-gooiseweg-51-1103bz',
    'totalenergies-flierbos-gooiseweg-50-1102bz',
    'tango-europoort-rijksweg-a15-200-3198ld',
    'ok-vondelingenweg-496-3194aj'
  )
order by city, name;
```

## Manual database steps

1. Review and run `supabase/migrations/2026-11-16_add_motorway_only_access.sql` in the Supabase SQL editor.
2. Re-apply or verify the public column grant in `supabase/shops_public_policy.sql` if that policy is managed manually.
3. Review `supabase/reviewed/2026-11-16_confirmed_motorway_only_access.sql`. It intentionally performs no update because category A is empty.
4. For any future candidate, collect location-specific evidence first, then add an exact `UPDATE` guarded by both `id` and `slug` to a newly dated reviewed SQL file.

No production Supabase data was changed during this audit.
