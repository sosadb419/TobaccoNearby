"use client";

import { track } from "@vercel/analytics";

export type SearchType = "neighborhood" | "postal_code" | "area" | "unknown";

const knownNeighborhoodInputs = new Set([
  "centrum",
  "de pijp",
  "jordaan",
  "de jordaan",
  "de wallen",
  "wallen",
  "red light district",
  "redlight district",
  "red-light district",
  "west",
  "nieuw west",
  "nieuw-west",
  "oost",
  "noord",
  "zuid",
  "zuidoost",
  "diemen",
  "bijlmer",
  "amsterdam bijlmer",
  "amsterdam west",
  "amsterdam nieuw west",
  "amsterdam nieuw-west",
  "amsterdam oost",
  "amsterdam noord",
  "amsterdam zuid",
  "amsterdam zuidoost",
  "diemen centrum",
  "diemen zuid",
  "diemen noord"
]);

const knownAreaInputs = new Set([
  "central station",
  "amsterdam centraal",
  "amsterdam central station",
  "centraal station",
  "center",
  "city centre",
  "dam",
  "damrak",
  "kinkerstraat",
  "oudezijds",
  "oudezijds voorburgwal",
  "oudezijds achterburgwal",
  "westerstraat",
  "noordermarkt",
  "rozengracht",
  "ferdinand bolstraat",
  "albert cuyp",
  "zeedijk",
  "warmoesstraat",
  "oud-west",
  "de baarsjes",
  "bos en lommer",
  "westerpark",
  "osdorp",
  "slotervaart",
  "slotermeer",
  "geuzenveld",
  "de aker",
  "nieuw sloten",
  "lelylaan",
  "plein 40-45",
  "osdorpplein",
  "indische buurt",
  "oosterpark",
  "watergraafsmeer",
  "ijburg",
  "javastraat",
  "dappermarkt",
  "ndsm",
  "buikslotermeer",
  "van der pek",
  "noord station",
  "museumkwartier",
  "rivierenbuurt",
  "buitenveldert",
  "hobbemakade",
  "zuidas",
  "rai",
  "bijlmer arena",
  "arena",
  "amsterdamse poort",
  "ganzenhoef",
  "kraaiennest",
  "holendrecht",
  "bullewijk",
  "diemen campus",
  "diemen station",
  "diemerplein",
  "verrijn stuart",
  "stationsplein",
  "prins hendrikkade"
]);

const analyticsNeighborhoods = new Map([
  ["centrum", "Centrum"],
  ["de pijp", "De Pijp"],
  ["jordaan", "Jordaan"],
  ["de wallen", "De Wallen"],
  ["west", "West"],
  ["nieuw west", "Nieuw-West"],
  ["nieuw-west", "Nieuw-West"],
  ["oost", "Oost"],
  ["noord", "Noord"],
  ["zuid", "Zuid"],
  ["zuidoost", "Zuidoost"],
  ["diemen", "Diemen"],
  ["amsterdam central station", "Amsterdam Central Station"],
  ["amsterdam centraal", "Amsterdam Central Station"]
]);

function normalize(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function safeShopSlug(shopSlug: string) {
  return /^[a-z0-9-]{1,100}$/i.test(shopSlug) ? shopSlug : "unknown";
}

function safeNeighborhood(neighborhood: string) {
  return analyticsNeighborhoods.get(normalize(neighborhood)) ?? "Other Amsterdam area";
}

function safeTrack(eventName: string, properties?: Record<string, string>) {
  try {
    track(eventName, properties);
  } catch {
    // Analytics must never interrupt navigation, age confirmation, or form use.
  }
}

export function classifySearchType(query: string): SearchType {
  const normalizedQuery = normalize(query);

  if (/^\d{4}(?:\s?[a-z]{2})?$/i.test(normalizedQuery)) {
    return "postal_code";
  }

  if (knownNeighborhoodInputs.has(normalizedQuery)) {
    return "neighborhood";
  }

  if (knownAreaInputs.has(normalizedQuery)) {
    return "area";
  }

  return "unknown";
}

export function trackSearchSubmitted(searchType: SearchType) {
  safeTrack("search_submitted", { search_type: searchType });
}

export function trackNeighborhoodClicked(neighborhood: string) {
  safeTrack("neighborhood_clicked", { neighborhood: safeNeighborhood(neighborhood) });
}

export function trackUseLocationClicked() {
  safeTrack("use_location_clicked", { result: "clicked" });
}

export function trackDirectionsClicked(shopSlug: string, neighborhood: string) {
  safeTrack("directions_clicked", {
    shop_slug: safeShopSlug(shopSlug),
    neighborhood: safeNeighborhood(neighborhood)
  });
}

export function trackShopDetailsClicked(shopSlug: string, neighborhood: string) {
  safeTrack("shop_details_clicked", {
    shop_slug: safeShopSlug(shopSlug),
    neighborhood: safeNeighborhood(neighborhood)
  });
}

export function trackReportInfoClicked(shopSlug: string, neighborhood: string) {
  safeTrack("report_info_clicked", {
    shop_slug: safeShopSlug(shopSlug),
    neighborhood: safeNeighborhood(neighborhood)
  });
}

export function trackShopSubmissionSubmitted(submissionType: string) {
  const safeSubmissionType =
    {
      "Add a new shop": "add_new_shop",
      "Update an existing shop": "update_existing_shop",
      "Request removal": "request_removal"
    }[submissionType] ?? "unknown";

  safeTrack("shop_submission_submitted", { submission_type: safeSubmissionType });
}

export function trackAgeGateAccepted() {
  safeTrack("age_gate_accepted");
}

export function trackAgeGateDeclined() {
  safeTrack("age_gate_declined");
}
