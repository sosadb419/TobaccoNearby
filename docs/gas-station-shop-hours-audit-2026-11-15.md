# Gas-station shop-hours audit

Checked: 2026-11-15

## Scope and decision rule

The production listing payload contained 28 published gas-station records with an all-week `00:00-23:59` or
`00:00-24:00` schedule. These records are potentially ambiguous because an operator may publish pump or forecourt
availability rather than staffed-shop hours.

Hours are marked as verified only when an operator's official location page explicitly identifies the schedule as
shop opening hours. General station hours, pump hours, a 24-hour payment terminal, or the mere presence of a shop do
not qualify. Records without explicit evidence remain unchanged and require manual confirmation.

## Verified shop hours

| Location | Address | Verified shop hours | Official evidence |
| --- | --- | --- | --- |
| Shell Hansa | Anthony Fokkerweg 8, 1059 CM Amsterdam | Daily 00:00-23:59 | [Shell](https://find.shell.com/nl/fuel/12661638-shell-station-hansa/nl_NL) lists a separate `Winkel openingstijden` section. |
| Shell Muntbergweg | Muntbergweg 20, 1101 ED Amsterdam | Daily 00:00-23:59 | [Shell](https://find.shell.com/nl/fuel/10030460-shell-station-muntbergweg/nl_NL) lists a separate `Winkel openingstijden` section. |
| Shell Maasboulevard | Maasboulevard 10, 3063 NM Rotterdam | Daily 00:00-23:59 | [Shell](https://find.shell.com/nl/fuel/10030452-shell-station-maasboulevard/nl_NL) lists a separate `Winkel openingstijden` section. |
| Shell Maastunnel | 's-Gravendijkwal 175, 3015 GH Rotterdam | Daily 00:00-23:59 | [Shell](https://find.shell.com/nl/fuel/13098023-shell-station-maastunnel/nl_NL) lists a separate `Winkel openingstijden` section. |
| Texaco Jacques Dutilhweg | Jacques Dutilhweg 851, 3065 JH Rotterdam | Daily 00:00-23:59 | [Texaco](https://texaco.nl/locatie/texaco-rotterdam-jac-dutilhweg/) lists daily `Openingstijden Shop` as 0:00-0:00 and identifies the station as staffed. |

The reviewed, non-executed correction is in
`supabase/reviewed/2026-11-15_verified_gas_station_shop_hours.sql`.

## Still requires shop-specific verification

### Rotterdam

| Location | Slug | Source reviewed | Why it remains unconfirmed |
| --- | --- | --- | --- |
| OK Tjalklaan | `ok-tjalklaan-12-3044az` | [OK](https://ok.nl/tankstations/ok-tjalklaan/) | The page explicitly says fuel is available at the pump 24/7; it does not separately label shop hours. |
| OK Capelseweg | `ok-capelseweg-355-3068ax` | [OK](https://ok.nl/tankstations/ok-capelseweg/) | The page explicitly says fuel is available at the pump 24/7; it does not separately label shop hours. |
| Argos Rotterdam | `argos-rotterdam-colosseumweg-470-3075lz` | [Argos](https://www.argos.nl/tankstation/argos-tankstation-rotterdam-colosseumweg/) | The page lists station hours, a shop, and a 24-hour payment terminal, but no separate shop schedule. |
| BP Charlois 2 Noordzijde | `bp-groene-kruisweg-389-3088nb` | [BP](https://map.bp.com/nl-NL/NL/tankstation/rotterdam/bp-charlois-2-noordzijde/13551) | No explicit shop-hours schedule was available in the official page content. |
| Esso Gordelweg | `esso-gordelweg-gordelweg-121-3038ga` | [Esso](https://www.esso.nl/nl-nl/find-station/rotterdam--essogordelweg-100320036) | The official page labels 24-hour availability as `Openingsuren tankstation`, not shop hours. |
| Esso Stadhoudersweg | `esso-stadhoudersweg-stadhoudersweg-215-3041jj` | [Esso](https://www.esso.nl/nl-nl/find-station/esso-rotterdam-essorotterdamstadhoudersweg-100359436) | No separate shop-hours schedule was found. |
| Esso Stadionweg | `esso-stadionweg-korte-stadionweg-111-3077me` | [Esso](https://www.esso.nl/nl-nl/find-station/rotterdam--esso-100175401) | No separate shop-hours schedule was found. |
| Esso Vaanweg | `esso-vaanweg-vaanweg-85-3084ec` | [Esso](https://www.esso.nl/nl-nl/find-station/rotterdam--esso-100360925) | No separate shop-hours schedule was found. |
| Esso Molenlaan Zuid | `esso-molenlaan-zuid-molenlaan-333-3055gm` | [Esso](https://www.esso.nl/nl-nl/find-station/esso-rotterdam-essomolenlaanzuid-100175395) | No separate shop-hours schedule was found. |

### Utrecht

| Location | Slug | Source reviewed | Why it remains unconfirmed |
| --- | --- | --- | --- |
| Esso Overvecht | `esso-overvecht-einsteindreef-11-3563ax` | [Esso](https://www.esso.nl/nl-nl/find-station/100359746) | The official page labels 24-hour availability as `Openingsuren tankstation`, not shop hours. |
| Esso Hoograven | `esso-hoograven-briljantlaan-15-3523cd` | [Esso](https://www.esso.nl/nl-nl/find-station/esso-utrecht-essovissersutrecht-100349891) | No separate shop-hours schedule was found. |
| Esso Utrecht 24 Oktoberplein | `esso-utrecht-24-oktoberplein-24-oktoberplein-1-3533ka` | [Esso](https://www.esso.nl/nl-nl/find-station/esso-utrecht-essoutrecht24oktoberplein-100359442) | No separate shop-hours schedule was found. |

### Amsterdam

| Location | Slug | Source reviewed | Why it remains unconfirmed |
| --- | --- | --- | --- |
| Esso Marnixstraat | `esso-marnixstraat-250-1016tl` | [Esso](https://www.esso.nl/nl-nl/find-station/amsterdam-essoamsterdammarnixstraat-100359732) | The official page labels 24-hour availability as `Openingsuren tankstation`, not shop hours. |
| TotalEnergies Ganzenhoef | `totalenergies-ganzenhoef-gooiseweg-51-1103bz` | [TotalEnergies](https://store.totalenergies.nl/nl/NN001608) | The official page could not be accessed reliably and no explicit shop-hours evidence was available. |
| TotalEnergies Flierbos | `totalenergies-flierbos-gooiseweg-50-1102bz` | [TotalEnergies](https://store.totalenergies.nl/nl/NN001611) | The official page could not be accessed reliably and no explicit shop-hours evidence was available. |
| TotalEnergies Kadoelen | `totalenergies-kadoelen-vorticellaweg-2-1035vb` | [TotalEnergies](https://store.totalenergies.nl/nl/NN001858) | The official page could not be accessed reliably and no explicit shop-hours evidence was available. |
| Esso Sarphatistraat | `esso-sarphatistraat-225-1018ae` | [Esso](https://www.esso.nl/nl-nl/find-station/amsterdam--essoamsterdamsarphatistraat-100359735) | No separate shop-hours schedule was found. |
| BP Zuiderzeeweg | `bp-zuiderzeeweg-1000-1023nw` | [BP](https://www.bp.com/) | The listing only has a generic operator URL and no shop-specific evidence. |
| BP Provincialeweg | `bp-provincialeweg-6-1112xt` | No operator location URL in the listing | Manual operator confirmation is required. |
| TotalEnergies Vlugtlaan | `totalenergies-vlugtlaan-burgemeester-de-vlugtlaan-121-1063bj` | [TotalEnergies](https://store.totalenergies.nl/nl/NN001742) | The official page could not be accessed reliably and no explicit shop-hours evidence was available. |
| TotalEnergies Kromwijkdreef | `totalenergies-kromwijkdreef-kromwijkdreef-20b-1104km` | [TotalEnergies](https://store.totalenergies.nl/nl/NN001638) | The official page could not be accessed reliably and no explicit shop-hours evidence was available. |
| Esso Utrechtse Brug | `esso-utrechtse-brug-nieuwe-utrechtseweg-10-1096ck` | [Esso](https://www.esso.nl/nl-nl/find-station/amsterdam--essoutrechtsebrug-100175320) | No separate shop-hours schedule was found. |
| BP Nieuwe Hemweg | `bp-nieuwe-hemweg-11-1013bg` | [OK](https://ok.nl/tankstations/bp-nieuwe-hemweg/) | No separate shop-hours schedule was found. |
