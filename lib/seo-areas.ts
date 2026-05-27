import { AreaSlug, getAreaDisplayName, normalizeAreaSlug } from "@/data/areas";
import { amsterdamCentralStation, getDistanceKm, normalize, Shop } from "@/data/shops";
import { filterShopsForArea, normalizeAreaText } from "@/lib/shop-data";

export type SeoAreaSlug = "amsterdam" | AreaSlug | "bijlmer";

const bijlmerTerms = [
  "Bijlmer",
  "Bijlmer ArenA",
  "Amsterdamse Poort",
  "Ganzenhoef",
  "Kraaiennest",
  "Holendrecht",
  "Bullewijk",
  "Reigersbos"
];

const centralStationTerms = [
  "Amsterdam Centraal",
  "Amsterdam Central Station",
  "Central Station",
  "Centraal Station",
  "Stationsplein",
  "Prins Hendrikkade",
  "Damrak",
  "Nieuwezijds Kolk",
  "Gare Centrale"
];

const deWallenTerms = [
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
];

export function normalizeSeoAreaSlug(value: string): SeoAreaSlug {
  const normalized = normalizeAreaSlug(value);

  if (normalized === "bijlmer") {
    return "bijlmer";
  }

  if (normalized === "amsterdam") {
    return "amsterdam";
  }

  return normalized as SeoAreaSlug;
}

export function getSeoAreaDisplayName(areaSlug: SeoAreaSlug) {
  if (areaSlug === "amsterdam") {
    return "Amsterdam";
  }

  if (areaSlug === "bijlmer") {
    return "Bijlmer";
  }

  return getAreaDisplayName(areaSlug);
}

export function filterShopsForSeoArea(shopList: Shop[], areaSlug: SeoAreaSlug) {
  const publicShops = shopList.filter(isPublicShop);

  if (areaSlug === "amsterdam") {
    return publicShops.filter((shop) => {
      const city = normalizeAreaText(shop.city);

      return !city || city.includes("amsterdam");
    });
  }

  if (areaSlug === "bijlmer") {
    return sortWithPriorityTerms(filterShopsForArea(publicShops, "zuidoost"), bijlmerTerms);
  }

  if (areaSlug === "central-station") {
    const exactMatches = filterShopsForArea(publicShops, "central-station");
    const termMatches = publicShops.filter((shop) => shopMatchesTerms(shop, centralStationTerms));
    const mergedMatches = uniqueShops([...exactMatches, ...termMatches]);
    const fallbackMatches = mergedMatches.length > 0 ? mergedMatches : filterShopsForArea(publicShops, "centrum");

    return fallbackMatches
      .map((shop) => ({ shop, distance: getDistanceKm(shop, amsterdamCentralStation) }))
      .sort((a, b) => a.distance - b.distance)
      .map(({ shop }) => shop);
  }

  if (areaSlug === "de-wallen") {
    const exactMatches = filterShopsForArea(publicShops, "de-wallen");
    const termMatches = publicShops.filter((shop) => shopMatchesTerms(shop, deWallenTerms));
    const mergedMatches = uniqueShops([...exactMatches, ...termMatches]);

    return mergedMatches.length > 0 ? sortWithPriorityTerms(mergedMatches, deWallenTerms) : filterShopsForArea(publicShops, "centrum");
  }

  return filterShopsForArea(publicShops, areaSlug);
}

function sortWithPriorityTerms(shopList: Shop[], terms: string[]) {
  return [...shopList].sort((a, b) => getPriorityScore(a, terms) - getPriorityScore(b, terms));
}

function getPriorityScore(shop: Shop, terms: string[]) {
  return shopMatchesTerms(shop, terms) ? 0 : 1;
}

function shopMatchesTerms(shop: Shop, terms: string[]) {
  const searchable = getSeoSearchableText(shop);

  return terms.some((term) => {
    const normalizedTerm = normalizeAreaText(term);

    return normalizedTerm && searchable.includes(normalizedTerm);
  });
}

function getSeoSearchableText(shop: Shop) {
  return normalizeAreaText(
    [
      shop.name,
      shop.address,
      shop.postalCode,
      shop.neighborhood,
      shop.city,
      shop.country,
      shop.area_slug,
      shop.nearbyPublicTransport
    ].join(" ")
  );
}

function uniqueShops(shopList: Shop[]) {
  const seen = new Set<string>();

  return shopList.filter((shop) => {
    const key = shop.id ?? shop.slug ?? normalize(`${shop.name}-${shop.address}`);

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

function isPublicShop(shop: Shop) {
  return !shop.status || shop.status === "published";
}
