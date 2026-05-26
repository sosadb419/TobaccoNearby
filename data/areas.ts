export type AreaSlug =
  | "centrum"
  | "de-pijp"
  | "jordaan"
  | "de-wallen"
  | "west"
  | "nieuw-west"
  | "oost"
  | "noord"
  | "zuid"
  | "zuidoost"
  | "diemen"
  | "central-station";

export type AreaDefinition = {
  slug: AreaSlug;
  href: string;
  label: string;
  searchLabel: string;
  fallbackTerms: string[];
};

export const areaDefinitions: AreaDefinition[] = [
  {
    slug: "centrum",
    href: "/amsterdam/centrum",
    label: "Centrum",
    searchLabel: "Centrum",
    fallbackTerms: [
      "Centrum",
      "Amsterdam Centrum",
      "Center",
      "City Centre",
      "Dam",
      "Damrak",
      "Nieuwendijk",
      "Kalverstraat",
      "Rokin",
      "Spui"
    ]
  },
  {
    slug: "de-pijp",
    href: "/amsterdam/de-pijp",
    label: "De Pijp",
    searchLabel: "De Pijp",
    fallbackTerms: ["De Pijp", "Pijp", "Ferdinand Bolstraat", "Albert Cuyp", "Ceintuurbaan", "Sarphatipark"]
  },
  {
    slug: "jordaan",
    href: "/amsterdam/jordaan",
    label: "Jordaan",
    searchLabel: "Jordaan",
    fallbackTerms: [
      "Jordaan",
      "De Jordaan",
      "Westerstraat",
      "Rozengracht",
      "Noordermarkt",
      "Elandsgracht",
      "Haarlemmerstraat",
      "Haarlemmerdijk"
    ]
  },
  {
    slug: "de-wallen",
    href: "/amsterdam/de-wallen",
    label: "De Wallen",
    searchLabel: "De Wallen",
    fallbackTerms: [
      "De Wallen",
      "Wallen",
      "Red Light District",
      "Redlight District",
      "Red-light District",
      "Oudezijds",
      "Oudezijds Voorburgwal",
      "Oudezijds Achterburgwal",
      "Warmoesstraat",
      "Zeedijk",
      "Centrum / De Wallen"
    ]
  },
  {
    slug: "west",
    href: "/amsterdam/west",
    label: "West",
    searchLabel: "West",
    fallbackTerms: [
      "West",
      "Amsterdam-West",
      "Amsterdam West",
      "Oud-West",
      "De Baarsjes",
      "Bos en Lommer",
      "Westerpark",
      "Kinkerstraat",
      "Overtoom",
      "Jan Pieter Heijestraat",
      "Bilderdijkstraat"
    ]
  },
  {
    slug: "nieuw-west",
    href: "/amsterdam/nieuw-west",
    label: "Nieuw-West",
    searchLabel: "Nieuw-West",
    fallbackTerms: [
      "Nieuw-West",
      "Amsterdam Nieuw-West",
      "Amsterdam-Nieuw-West",
      "Osdorp",
      "Slotervaart",
      "Slotermeer",
      "Geuzenveld",
      "De Aker",
      "Nieuw Sloten",
      "Lelylaan",
      "Plein 40-45",
      "Osdorpplein",
      "Sloterplas"
    ]
  },
  {
    slug: "oost",
    href: "/amsterdam/oost",
    label: "Oost",
    searchLabel: "Oost",
    fallbackTerms: [
      "Oost",
      "Amsterdam-Oost",
      "Amsterdam Oost",
      "Indische Buurt",
      "Oosterpark",
      "Watergraafsmeer",
      "IJburg",
      "Oostpoort",
      "Linnaeusstraat",
      "Javastraat",
      "Dappermarkt"
    ]
  },
  {
    slug: "noord",
    href: "/amsterdam/noord",
    label: "Noord",
    searchLabel: "Noord",
    fallbackTerms: [
      "Noord",
      "Amsterdam-Noord",
      "Amsterdam Noord",
      "NDSM",
      "Buikslotermeer",
      "Van der Pek",
      "Noord station",
      "Mosplein"
    ]
  },
  {
    slug: "zuid",
    href: "/amsterdam/zuid",
    label: "Zuid",
    searchLabel: "Zuid",
    fallbackTerms: [
      "Zuid",
      "Amsterdam-Zuid",
      "Amsterdam Zuid",
      "Museumkwartier",
      "Rivierenbuurt",
      "Buitenveldert",
      "Hobbemakade",
      "Beethovenstraat",
      "Stadionbuurt",
      "Olympisch Stadion",
      "Zuidas",
      "RAI"
    ]
  },
  {
    slug: "zuidoost",
    href: "/amsterdam/zuidoost",
    label: "Zuidoost",
    searchLabel: "Zuidoost",
    fallbackTerms: [
      "Zuidoost",
      "Amsterdam-Zuidoost",
      "Amsterdam Zuidoost",
      "Bijlmer",
      "Bijlmer ArenA",
      "ArenA",
      "Amsterdamse Poort",
      "Ganzenhoef",
      "Kraaiennest",
      "Holendrecht",
      "Bullewijk",
      "Reigersbos"
    ]
  },
  {
    slug: "diemen",
    href: "/amsterdam/diemen",
    label: "Diemen",
    searchLabel: "Diemen",
    fallbackTerms: [
      "Diemen",
      "Diemen Centrum",
      "Diemen Zuid",
      "Diemen Noord",
      "Diemen Sniep",
      "Diemen Campus",
      "Verrijn Stuart",
      "Diemen station",
      "Diemerplein"
    ]
  },
  {
    slug: "central-station",
    href: "/amsterdam/near-central-station",
    label: "Amsterdam Central Station",
    searchLabel: "Amsterdam Centraal",
    fallbackTerms: [
      "Amsterdam Centraal",
      "Amsterdam Central Station",
      "Central Station",
      "Centraal Station",
      "Stationsplein",
      "Prins Hendrikkade",
      "Damrak",
      "Nieuwezijds Kolk"
    ]
  }
];

export const areaSlugSet = new Set(areaDefinitions.map((area) => area.slug));

export function getAreaDefinition(areaSlug: string) {
  return areaDefinitions.find((area) => area.slug === normalizeAreaSlug(areaSlug));
}

export function getAreaDisplayName(areaSlug: string) {
  return getAreaDefinition(areaSlug)?.label ?? areaSlug;
}

export function normalizeAreaSlug(value: string) {
  const normalized = value.trim().toLowerCase().replace(/_/g, "-").replace(/\s+/g, "-");
  const canonical =
    normalized === "near-central-station" || normalized === "amsterdam-central-station" ? "central-station" : normalized;

  return areaSlugSet.has(canonical as AreaSlug) ? (canonical as AreaSlug) : canonical;
}
