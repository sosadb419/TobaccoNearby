import { cache } from "react";
import { supabase } from "@/lib/supabase";
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
  "name,slug,address,postal_code,city,country,latitude,longitude,neighborhood,opening_hours,phone,website,google_maps_url,wheelchair_accessible,public_transport_info,last_updated,updated_at,status,verified,last_checked_at,place_type";

const searchAliases: Record<string, string> = {
  bijlmer: "Zuidoost",
  "amsterdam-bijlmer": "Zuidoost",
  zuidoost: "Zuidoost",
  "central-station": "Centrum",
  "amsterdam-centraal": "Centrum",
  "centraal-station": "Centrum",
  dam: "Centrum",
  wallen: "Centrum",
  "de-wallen": "Centrum",
  "red-light-district": "Centrum",
  "redlight-district": "Centrum",
  oudezijds: "Centrum",
  "oudezijds-voorburgwal": "Centrum",
  "oudezijds-achterburgwal": "Centrum",
  "de-pijp": "De Pijp",
  jordaan: "Jordaan",
  "de-jordaan": "Jordaan",
  westerstraat: "Jordaan",
  noordermarkt: "Jordaan",
  rozengracht: "Jordaan",
  west: "West",
  kinkerstraat: "West",
  oost: "Oost",
  noord: "Noord",
  zuid: "Zuid"
};

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

  return shopList.filter((shop) => normalize(shop.neighborhood) === normalize(neighborhood));
}

export async function getShopsForDeWallen() {
  const shopList = await getAllShops();
  const exactMatches = shopList.filter((shop) => normalize(shop.neighborhood) === "de-wallen");

  if (exactMatches.length > 0) {
    return exactMatches;
  }

  return shopList.filter((shop) => normalize(shop.neighborhood) === "centrum");
}

export async function getShopsForCentralStationArea() {
  const shopList = await getAllShops();

  return shopList
    .filter((shop) => {
      const searchable = getShopSearchableText(shop);

      return (
        normalize(shop.neighborhood) === "centrum" ||
        searchable.includes("central-station") ||
        searchable.includes("centraal-station") ||
        searchable.includes("amsterdam-centraal")
      );
    })
    .map((shop) => ({
      shop,
      distance: getDistanceKm(shop, amsterdamCentralStation)
    }))
    .sort((a, b) => a.distance - b.distance)
    .map(({ shop }) => shop);
}

export async function getShopsForZuidoostArea() {
  const shopList = await getAllShops();

  return shopList.filter((shop) => {
    const searchable = getShopSearchableText(shop);

    return normalize(shop.neighborhood) === "zuidoost" || searchable.includes("bijlmer");
  });
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

  return shopList.filter((shop) => {
    const searchable = normalize(
      [shop.name, shop.address, shop.postalCode, shop.neighborhood, shop.city].join(" ")
    );

    if (searchable.includes(value)) {
      return true;
    }

    return aliasTargets.some((target) => normalize(shop.neighborhood) === normalize(target));
  });
}

function normalizeSearchValue(query: string) {
  return normalize(query.trim());
}

function getShopSearchableText(shop: Shop) {
  return normalize(
    [
      shop.name,
      shop.address,
      shop.postalCode,
      shop.neighborhood,
      shop.city,
      shop.nearbyPublicTransport ?? ""
    ].join(" ")
  );
}

function getSearchAliasTargets(value: string) {
  const exactTarget = searchAliases[value];
  const targets = exactTarget ? [exactTarget] : [];

  Object.entries(searchAliases).forEach(([alias, target]) => {
    const shouldMatchInsideQuery = alias.length >= 6 || alias.includes("-");

    if (shouldMatchInsideQuery && value.includes(alias) && !targets.includes(target)) {
      targets.push(target);
    }
  });

  return targets;
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
      return [{ days, opens: "00:00", closes: "00:00", note: value }];
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
