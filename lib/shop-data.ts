import { cache } from "react";
import { supabase } from "@/lib/supabase";
import {
  amsterdamCentralStation,
  DayName,
  OpeningHoursSlot,
  Shop,
  getShopBySlug as getLocalShopBySlug,
  getShopsByNeighborhood as getLocalShopsByNeighborhood,
  getShopsNearCentralStation as getLocalShopsNearCentralStation,
  normalize,
  searchShops as searchLocalShops,
  shops as localShops
} from "@/data/shops";

export const SHOP_REVALIDATE_SECONDS = 3600;

type SupabaseShopRow = Record<string, unknown>;

const fallbackOpeningHours: OpeningHoursSlot[] = [
  {
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: "09:00",
    closes: "18:00",
    note: "verify before visiting"
  }
];

export const getAllShops = cache(async (): Promise<Shop[]> => {
  if (!supabase) {
    return localShops;
  }

  try {
    const { data, error } = await supabase.from("shops").select("*");

    if (error || !data) {
      return localShops;
    }

    const mappedShops = (data.map(mapSupabaseShop).filter(Boolean) as Shop[])
      .filter((shop) => normalize(shop.city) === "amsterdam")
      .sort((a, b) => b.lastUpdated.localeCompare(a.lastUpdated));

    return mappedShops;
  } catch {
    return localShops;
  }
});

export async function getShopBySlug(slug: string) {
  const shopList = await getAllShops();

  return getLocalShopBySlug(slug, shopList);
}

export async function getShopsByNeighborhood(neighborhood: string) {
  const shopList = await getAllShops();

  return getLocalShopsByNeighborhood(neighborhood, shopList);
}

export async function getShopsNearCentralStation(maxKm = 1.5) {
  const shopList = await getAllShops();

  return getLocalShopsNearCentralStation(maxKm, shopList);
}

export async function searchShops(query: string) {
  const shopList = await getAllShops();

  return searchLocalShops(query, shopList);
}

function mapSupabaseShop(row: SupabaseShopRow): Shop | null {
  const name = readString(row, ["name", "shop_name", "title"]);

  if (!name) {
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
    city,
    country,
    wheelchairAccessible: readBoolean(row, ["wheelchair_accessible", "accessible"]),
    nearbyPublicTransport: readString(row, [
      "nearby_public_transport",
      "nearby_public_transport_notes",
      "public_transport_notes",
      "transit_notes"
    ])
  };
}

function readOpeningHours(row: SupabaseShopRow): OpeningHoursSlot[] {
  const raw = readRaw(row, ["opening_hours", "openingHours", "hours"]);

  if (!raw) {
    return fallbackOpeningHours;
  }

  if (Array.isArray(raw)) {
    const slots = raw.map(parseOpeningHoursSlot).filter(Boolean) as OpeningHoursSlot[];

    return slots.length > 0 ? slots : fallbackOpeningHours;
  }

  if (typeof raw === "object") {
    const slots = Object.entries(raw).flatMap(([day, value]) => parseDayEntry(day, value));

    return slots.length > 0 ? slots : fallbackOpeningHours;
  }

  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw) as unknown;

      return readOpeningHours({ opening_hours: parsed });
    } catch {
      return [
        {
          days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          opens: "00:00",
          closes: "00:00",
          note: raw
        }
      ];
    }
  }

  return fallbackOpeningHours;
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
