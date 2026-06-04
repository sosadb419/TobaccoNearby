import { cache } from "react";
import { supabase } from "@/lib/supabase";
import {
  AreaSlug,
  areaDefinitions,
  getAreaDefinition,
  getAreaDisplayName as getSharedAreaDisplayName,
  normalizeAreaSlug
} from "@/data/areas";
import {
  amsterdamCentralStation,
  DayName,
  OpeningHoursSlot,
  Shop,
  getDistanceKm,
  normalize,
  shops as localShops
} from "@/data/shops";

type SupabaseShopRow = Record<string, unknown>;

const shopSelectColumns =
  "id,name,slug,address,postal_code,city,country,latitude,longitude,neighborhood,opening_hours,phone,website,google_maps_url,wheelchair_accessible,public_transport_info,last_updated,updated_at,status,verified,last_checked_at,place_type,area_slug";

// This deduplicates reads during one server render only. Supabase requests remain no-store.
const fetchAllShopsForRequest = cache(async (): Promise<Shop[]> => {
  if (!supabase) {
    console.error(
      "Supabase is not configured. Falling back to local shop data. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
    );
    return localShops;
  }

  try {
    const { data, error } = await fetchPublishedShopRows(supabase);

    if (error) {
      console.error("Supabase shops fetch failed. Falling back to local shop data.", error);
      return localShops;
    }

    if (!data || data.length === 0) {
      return [];
    }

    const mappedShops = (data.map(mapSupabaseShop).filter(Boolean) as Shop[]).sort((a, b) =>
      b.lastUpdated.localeCompare(a.lastUpdated)
    );

    if (mappedShops.length === 0) {
      console.error("Supabase returned published shop rows, but no public listings could be mapped.");
      return [];
    }

    return mappedShops;
  } catch (error) {
    console.error("Unexpected Supabase shops fetch failure. Falling back to local shop data.", error);
    return localShops;
  }
});

export async function getAllShops(): Promise<Shop[]> {
  return fetchAllShopsForRequest();
}

export async function getShopBySlug(slug: string) {
  const shopList = await getAllShops();

  return shopList.find((shop) => shop.slug === slug) ?? null;
}

export async function getShopsByNeighborhood(neighborhood: string) {
  const shopList = await getAllShops();

  const areaSlug = getAreaSlugFromLabel(neighborhood);

  if (areaSlug) {
    return filterShopsForArea(shopList, areaSlug);
  }

  return shopList.filter(
    (shop) => isPublicShop(shop) && normalizeAreaText(shop.neighborhood).includes(normalizeAreaText(neighborhood))
  );
}

export async function getShopsForDeWallen() {
  return getShopsForArea("de-wallen");
}

export async function getShopsForCentralStationArea() {
  const shops = await getShopsForArea("central-station");

  return shops
    .map((shop) => ({
      shop,
      distance: getDistanceKm(shop, amsterdamCentralStation)
    }))
    .sort((a, b) => a.distance - b.distance)
    .map(({ shop }) => shop);
}

export async function getShopsForZuidoostArea() {
  return getShopsForArea("zuidoost");
}

export async function getShopsForArea(areaSlug: string) {
  const shopList = await getAllShops();

  return filterShopsForArea(shopList, areaSlug);
}

export function filterShopsForArea(shopList: Shop[], areaSlug: string) {
  const normalizedAreaSlug = normalizeAreaSlug(areaSlug);
  const filtered = shopList.filter((shop) => isPublicShop(shop) && matchesArea(shop, normalizedAreaSlug));

  if (normalizedAreaSlug === "central-station") {
    return filtered
      .map((shop) => ({
        shop,
        distance: getDistanceKm(shop, amsterdamCentralStation)
      }))
      .sort((a, b) => a.distance - b.distance)
      .map(({ shop }) => shop);
  }

  return filtered;
}

export async function getShopsNearCentralStation(maxKm = 1.5) {
  const shopList = await getAllShops();

  return shopList
    .map((shop) => ({
      shop,
      distance: getDistanceKm(shop, amsterdamCentralStation)
    }))
    .filter(({ distance }) => distance <= maxKm)
    .sort((a, b) => a.distance - b.distance)
    .map(({ shop }) => shop);
}

export async function searchShops(query: string) {
  const shopList = await getAllShops();
  const value = normalizeSearchValue(query);

  if (!value) {
    return shopList;
  }

  const aliasTargets = getSearchAliasTargets(value);
  const isGeneralAmsterdamQuery = isGeneralAmsterdamSearch(value);

  const matchedShops = shopList.filter((shop) => {
    const searchable = getShopSearchableText(shop);

    if (matchesNormalizedText(searchable, value)) {
      return true;
    }

    if (aliasTargets.some((target) => matchesArea(shop, target))) {
      return true;
    }

    return isGeneralAmsterdamQuery && normalizeAreaText(shop.city).includes("amsterdam");
  });

  return sortSearchResultsForQuery(matchedShops, value);
}

function normalizeSearchValue(query: string) {
  return normalizeAreaText(query.trim());
}

function getShopSearchableText(shop: Shop) {
  return normalizeAreaText(
    [
      shop.name,
      shop.address,
      shop.postalCode,
      shop.neighborhood,
      shop.city,
      shop.country,
      shop.place_type ?? "",
      shop.area_slug ?? "",
      shop.nearbyPublicTransport ?? ""
    ].join(" ")
  );
}

function getSearchAliasTargets(value: string) {
  const targets: AreaSlug[] = [];

  areaDefinitions.forEach((area) => {
    const aliases = [area.slug, area.label, area.searchLabel, ...area.fallbackTerms].map(normalizeAreaText);

    if (
      aliases.some((alias) => {
        const shouldMatchInsideQuery = alias.length >= 5;

        return value === alias || (shouldMatchInsideQuery && value.includes(alias));
      })
    ) {
      targets.push(area.slug);
    }
  });

  return targets;
}

function isGeneralAmsterdamSearch(value: string) {
  const hasAmsterdam = value.includes("amsterdam");
  const hasNearMeIntent =
    value.includes("near me") ||
    value.includes("in de buurt") ||
    value.includes("mijn locatie") ||
    value.includes("nearby");

  if (!hasAmsterdam && !hasNearMeIntent) {
    return false;
  }

  return [
    "sigaretten kopen",
    "waar sigaretten kopen",
    "waar kan ik sigaretten kopen",
    "where to buy cigarettes",
    "buy cigarettes",
    "cigarettes",
    "tobacco shop",
    "tobacco shops",
    "tabakswinkel",
    "tabakszaak",
    "zigaretten kaufen",
    "cigarettes kaufen",
    "tabakladen",
    "tabakgeschaft",
    "acheter cigarettes",
    "acheter des cigarettes",
    "ou acheter des cigarettes",
    "bureau de tabac",
    "bureaux de tabac"
  ].some((term) => value.includes(normalizeAreaText(term)));
}

function sortSearchResultsForQuery(shopList: Shop[], value: string) {
  const priorityTerms = getPriorityTermsForSearch(value);

  if (priorityTerms.length === 0) {
    return shopList;
  }

  return [...shopList].sort((a, b) => getSearchPriorityScore(a, priorityTerms) - getSearchPriorityScore(b, priorityTerms));
}

function getPriorityTermsForSearch(value: string) {
  if (value.includes("bijlmer")) {
    return ["bijlmer", "bijlmer arena", "amsterdamse poort", "ganzenhoef", "kraaiennest"];
  }

  if (value.includes("central station") || value.includes("centraal") || value.includes("gare centrale")) {
    return ["amsterdam centraal", "central station", "centraal station", "stationsplein", "damrak", "prins hendrikkade"];
  }

  return [];
}

function getSearchPriorityScore(shop: Shop, priorityTerms: string[]) {
  const searchable = getShopSearchableText(shop);

  return priorityTerms.some((term) => matchesNormalizedText(searchable, normalizeAreaText(term))) ? 0 : 1;
}

function matchesArea(shop: Shop, areaSlug: string) {
  const normalizedAreaSlug = normalizeAreaSlug(areaSlug);
  const shopAreaSlug = shop.area_slug?.trim();

  if (shopAreaSlug) {
    return normalizeAreaSlug(shopAreaSlug) === normalizedAreaSlug;
  }

  return matchesAreaFallback(shop, normalizedAreaSlug);
}

export function matchesAreaFallback(shop: Shop, areaSlug: string) {
  const area = getAreaDefinition(areaSlug);

  if (!area) {
    return false;
  }

  const searchable = getShopSearchableText(shop);

  return area.fallbackTerms.some((term) => matchesNormalizedText(searchable, normalizeAreaText(term)));
}

export function normalizeAreaText(value?: string) {
  return (value ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function matchesNormalizedText(searchable: string, term: string) {
  const normalizedTerm = normalizeAreaText(term);

  if (!normalizedTerm) {
    return false;
  }

  if (!normalizedTerm.includes(" ")) {
    return searchable.split(" ").includes(normalizedTerm);
  }

  return searchable.includes(normalizedTerm);
}

export function getAreaDisplayName(areaSlug: string) {
  return getSharedAreaDisplayName(areaSlug);
}

function getAreaSlugFromLabel(label: string) {
  const normalizedLabel = normalizeAreaText(label);
  const area = areaDefinitions.find(
    (item) =>
      normalizeAreaText(item.label) === normalizedLabel ||
      normalizeAreaText(item.searchLabel) === normalizedLabel ||
      item.fallbackTerms.some((term) => normalizeAreaText(term) === normalizedLabel)
  );

  return area?.slug;
}

function isPublicShop(shop: Shop) {
  return !shop.status || shop.status === "published";
}

function mapSupabaseShop(row: SupabaseShopRow): Shop | null {
  const hasStatusField = Object.prototype.hasOwnProperty.call(row, "status");
  const status = readString(row, ["status"]);
  const name = readString(row, ["name", "shop_name", "title"]);

  if ((hasStatusField && status !== "published") || !name) {
    return null;
  }

  const addressLine1 = readString(row, ["address", "address_line_1", "street_address"]) ?? "";
  const addressLine2 = readString(row, ["address_line_2", "address_extra"]);
  const latitude = readNumber(row, ["latitude", "lat"], amsterdamCentralStation.latitude);
  const longitude = readNumber(row, ["longitude", "lng", "lon"], amsterdamCentralStation.longitude);
  const slug = readString(row, ["slug"]) ?? slugify(name);
  const city = readString(row, ["city"]) ?? "Amsterdam";
  const country = readString(row, ["country"]) ?? "Netherlands";
  const googleMapsLink =
    readString(row, ["google_maps_link", "google_maps_url", "maps_url", "map_url"]) ??
    `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

  return {
    id: readId(row, ["id"]),
    name,
    slug,
    address: addressLine2 ? `${addressLine1}, ${addressLine2}` : addressLine1,
    postalCode: readString(row, ["postal_code", "postalCode", "postcode"]) ?? "",
    latitude,
    longitude,
    neighborhood: readString(row, ["neighborhood", "area", "district"]) ?? "Amsterdam",
    openingHours: readOpeningHours(row),
    phone: readString(row, ["phone", "phone_number", "telephone"]),
    website: readString(row, ["website", "website_url", "url"]),
    googleMapsLink,
    lastUpdated:
      readDate(row, ["last_updated", "last_updated_at", "updated_at"]) ?? new Date().toISOString().slice(0, 10),
    status: status ?? "published",
    verified: readBoolean(row, ["verified"]),
    last_checked_at: readDate(row, ["last_checked_at"]),
    place_type: readString(row, ["place_type", "placeType"]) ?? "tobacco_shop",
    area_slug: readString(row, ["area_slug", "areaSlug"]),
    city,
    country,
    wheelchairAccessible: readBoolean(row, ["wheelchair_accessible", "accessible"]),
    nearbyPublicTransport: readString(row, [
      "public_transport_info",
      "nearby_public_transport",
      "nearby_public_transport_notes",
      "public_transport_notes",
      "transit_notes"
    ])
  };
}

function readId(row: SupabaseShopRow, keys: string[]) {
  const value = readRaw(row, keys);

  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }

  return undefined;
}

async function fetchPublishedShopRows(client: NonNullable<typeof supabase>) {
  const publishedQuery = await client.from("shops").select(shopSelectColumns).eq("status", "published");

  if (!publishedQuery.error || !isMissingColumnError(publishedQuery.error)) {
    return publishedQuery;
  }

  console.error(
    "Supabase shops fetch with status filter failed because a selected column is missing. Retrying with available columns.",
    publishedQuery.error
  );

  return client.from("shops").select("*");
}

function isMissingColumnError(error: unknown) {
  if (!error || typeof error !== "object") {
    return false;
  }

  const details = [readErrorField(error, "message"), readErrorField(error, "details"), readErrorField(error, "hint")]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  const code = readErrorField(error, "code");

  return code === "42703" || details.includes("column") || details.includes("schema cache");
}

function readErrorField(error: object, key: string) {
  const value = (error as Record<string, unknown>)[key];

  return typeof value === "string" ? value : undefined;
}

function readOpeningHours(row: SupabaseShopRow): OpeningHoursSlot[] {
  const raw = readRaw(row, ["opening_hours", "openingHours", "hours"]);

  if (!raw) {
    return [];
  }

  if (Array.isArray(raw)) {
    const slots = raw.map(parseOpeningHoursSlot).filter(Boolean) as OpeningHoursSlot[];

    return slots;
  }

  if (typeof raw === "object") {
    const slots = Object.entries(raw).flatMap(([day, value]) => parseDayEntry(day, value));

    return slots;
  }

  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw) as unknown;

      return readOpeningHours({ opening_hours: parsed });
    } catch {
      return [];
    }
  }

  return [];
}

function parseOpeningHoursSlot(value: unknown): OpeningHoursSlot | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const record = value as Record<string, unknown>;
  const rawDays = record.days ?? record.dayOfWeek ?? record.day;
  const days = parseDays(rawDays);
  const opens = String(record.opens ?? record.open ?? record.opens_at ?? "").trim();
  const closes = String(record.closes ?? record.close ?? record.closes_at ?? "").trim();

  if (days.length === 0 || !opens || !closes) {
    return null;
  }

  return {
    days,
    opens,
    closes,
    note: typeof record.note === "string" ? record.note : undefined
  };
}

function parseDayEntry(day: string, value: unknown): OpeningHoursSlot[] {
  const days = parseDays(day);

  if (days.length === 0 || !value) {
    return [];
  }

  if (typeof value === "string") {
    const match = value.match(/(\d{1,2}:\d{2})\s*[-–]\s*(\d{1,2}:\d{2})/);

    if (!match) {
      return isClosedOpeningHoursText(value) ? [{ days, opens: "00:00", closes: "00:00", note: "Closed" }] : [];
    }

    return [{ days, opens: normalizeTime(match[1]), closes: normalizeTime(match[2]) }];
  }

  if (typeof value === "object") {
    const slot = parseOpeningHoursSlot({ ...(value as Record<string, unknown>), days });

    return slot ? [slot] : [];
  }

  return [];
}

function parseDays(value: unknown): DayName[] {
  if (Array.isArray(value)) {
    return value.flatMap(parseDays);
  }

  if (typeof value !== "string") {
    return [];
  }

  const normalized = value.trim().replace(/^https:\/\/schema\.org\//, "");
  const days: DayName[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const match = days.find((day) => normalize(day) === normalize(normalized));

  return match ? [match] : [];
}

function readString(row: SupabaseShopRow, keys: string[]) {
  const value = readRaw(row, keys);

  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function readNumber(row: SupabaseShopRow, keys: string[], fallback: number) {
  const value = readRaw(row, keys);
  const number = typeof value === "number" ? value : typeof value === "string" ? Number(value) : Number.NaN;

  return Number.isFinite(number) ? number : fallback;
}

function readBoolean(row: SupabaseShopRow, keys: string[]) {
  const value = readRaw(row, keys);

  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    if (["true", "yes", "1"].includes(value.toLowerCase())) return true;
    if (["false", "no", "0"].includes(value.toLowerCase())) return false;
  }

  return undefined;
}

function readDate(row: SupabaseShopRow, keys: string[]) {
  const value = readRaw(row, keys);

  if (typeof value !== "string" || !value.trim()) {
    return undefined;
  }

  return value.slice(0, 10);
}

function readRaw(row: SupabaseShopRow, keys: string[]) {
  for (const key of keys) {
    if (row[key] !== undefined && row[key] !== null) {
      return row[key];
    }
  }

  return undefined;
}

function slugify(value: string) {
  return normalize(value)
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function normalizeTime(value: string) {
  const [hour, minute] = value.split(":");

  return `${hour.padStart(2, "0")}:${minute}`;
}

function isClosedOpeningHoursText(value: string) {
  const normalized = normalizeAreaText(value);

  return normalized === "closed" || normalized === "gesloten";
}
