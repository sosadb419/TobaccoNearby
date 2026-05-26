export type DayName =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

export type OpeningHoursSlot = {
  days: DayName[];
  opens: string;
  closes: string;
  note?: string;
};

export type Shop = {
  id?: string;
  name: string;
  slug: string;
  address: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  neighborhood: string;
  openingHours: OpeningHoursSlot[];
  phone?: string;
  website?: string;
  googleMapsLink: string;
  lastUpdated: string;
  status?: string;
  verified?: boolean;
  last_checked_at?: string;
  source_url?: string;
  internal_notes?: string;
  place_type?: string;
  city: string;
  country: string;
  wheelchairAccessible?: boolean;
  nearbyPublicTransport?: string;
};

export type Coordinates = {
  latitude: number;
  longitude: number;
};

export const amsterdamCentralStation: Coordinates = {
  latitude: 52.379128,
  longitude: 4.900272
};

export const neighborhoods = [
  { name: "Centrum", slug: "centrum" },
  { name: "De Pijp", slug: "de-pijp" },
  { name: "Jordaan", slug: "jordaan" },
  { name: "Oost", slug: "oost" },
  { name: "West", slug: "west" },
  { name: "Noord", slug: "noord" },
  { name: "Zuid", slug: "zuid" },
  { name: "Zuidoost", slug: "zuidoost" }
];

export const placeTypes = [
  { value: "tobacco_shop", label: "Tobacco shop" },
  { value: "kiosk", label: "Kiosk" },
  { value: "gas_station", label: "Gas station" },
  { value: "convenience_store", label: "Convenience store" },
  { value: "night_shop", label: "Night shop" },
  { value: "other", label: "Other location" }
];

const weekdays: DayName[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const allDays: DayName[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday"
];

export const shops: Shop[] = [
  {
    name: "Centrum Tobacco Point",
    slug: "centrum-tobacco-point",
    address: "Damrak 42",
    postalCode: "1012 LK",
    latitude: 52.375763,
    longitude: 4.897967,
    neighborhood: "Centrum",
    openingHours: [
      { days: weekdays, opens: "09:00", closes: "18:00" },
      { days: ["Saturday"], opens: "10:00", closes: "17:00" }
    ],
    phone: "+31 20 000 1001",
    website: "https://example.com/centrum-tobacco-point",
    googleMapsLink: "https://www.google.com/maps/search/?api=1&query=52.375763,4.897967",
    lastUpdated: "2026-05-12",
    status: "published",
    place_type: "tobacco_shop",
    city: "Amsterdam",
    country: "Netherlands",
    wheelchairAccessible: true,
    nearbyPublicTransport: "Amsterdam Central Station, tram stops at Dam and Nieuwezijds Kolk."
  },
  {
    name: "Jordaan Corner Tobacconist",
    slug: "jordaan-corner-tobacconist",
    address: "Westerstraat 88",
    postalCode: "1015 ML",
    latitude: 52.380432,
    longitude: 4.881354,
    neighborhood: "Jordaan",
    openingHours: [
      { days: weekdays, opens: "09:30", closes: "18:00" },
      { days: ["Saturday"], opens: "10:00", closes: "16:00" }
    ],
    phone: "+31 20 000 1002",
    googleMapsLink: "https://www.google.com/maps/search/?api=1&query=52.380432,4.881354",
    lastUpdated: "2026-05-10",
    status: "published",
    place_type: "kiosk",
    city: "Amsterdam",
    country: "Netherlands",
    wheelchairAccessible: false,
    nearbyPublicTransport: "Tram and bus stops near Marnixplein."
  },
  {
    name: "De Pijp Tobacco Service",
    slug: "de-pijp-tobacco-service",
    address: "Ferdinand Bolstraat 112",
    postalCode: "1072 LP",
    latitude: 52.354782,
    longitude: 4.891611,
    neighborhood: "De Pijp",
    openingHours: [
      { days: weekdays, opens: "08:30", closes: "19:00" },
      { days: ["Saturday"], opens: "09:30", closes: "18:00" },
      { days: ["Sunday"], opens: "12:00", closes: "17:00", note: "hours may vary" }
    ],
    phone: "+31 20 000 1003",
    website: "https://example.com/de-pijp-tobacco-service",
    googleMapsLink: "https://www.google.com/maps/search/?api=1&query=52.354782,4.891611",
    lastUpdated: "2026-05-11",
    status: "published",
    place_type: "tobacco_shop",
    city: "Amsterdam",
    country: "Netherlands",
    wheelchairAccessible: true,
    nearbyPublicTransport: "Metro station De Pijp and tram stops on Ferdinand Bolstraat."
  },
  {
    name: "Oost Neighborhood Tobacco Desk",
    slug: "oost-neighborhood-tobacco-desk",
    address: "Linnaeusstraat 67",
    postalCode: "1093 EJ",
    latitude: 52.360155,
    longitude: 4.925732,
    neighborhood: "Oost",
    openingHours: [
      { days: weekdays, opens: "09:00", closes: "18:30" },
      { days: ["Saturday"], opens: "10:00", closes: "17:00" }
    ],
    googleMapsLink: "https://www.google.com/maps/search/?api=1&query=52.360155,4.925732",
    lastUpdated: "2026-05-09",
    status: "published",
    place_type: "convenience_store",
    city: "Amsterdam",
    country: "Netherlands",
    wheelchairAccessible: true,
    nearbyPublicTransport: "Amsterdam Muiderpoort station and tram stops nearby."
  },
  {
    name: "Amsterdam West Tobacco Counter",
    slug: "amsterdam-west-tobacco-counter",
    address: "Jan Evertsenstraat 126",
    postalCode: "1056 EH",
    latitude: 52.370811,
    longitude: 4.855126,
    neighborhood: "West",
    openingHours: [
      { days: weekdays, opens: "09:00", closes: "19:00" },
      { days: ["Saturday"], opens: "10:00", closes: "18:00" }
    ],
    phone: "+31 20 000 1005",
    googleMapsLink: "https://www.google.com/maps/search/?api=1&query=52.370811,4.855126",
    lastUpdated: "2026-05-08",
    status: "published",
    place_type: "night_shop",
    city: "Amsterdam",
    country: "Netherlands",
    wheelchairAccessible: undefined,
    nearbyPublicTransport: "Tram stops on Jan Evertsenstraat."
  },
  {
    name: "Noord Tobacco Information Point",
    slug: "noord-tobacco-information-point",
    address: "Van der Pekstraat 56",
    postalCode: "1031 EE",
    latitude: 52.389031,
    longitude: 4.913202,
    neighborhood: "Noord",
    openingHours: [
      { days: weekdays, opens: "09:30", closes: "18:00" },
      { days: ["Saturday"], opens: "10:00", closes: "16:00" }
    ],
    website: "https://example.com/noord-tobacco-information-point",
    googleMapsLink: "https://www.google.com/maps/search/?api=1&query=52.389031,4.913202",
    lastUpdated: "2026-05-07",
    status: "published",
    place_type: "kiosk",
    city: "Amsterdam",
    country: "Netherlands",
    wheelchairAccessible: true,
    nearbyPublicTransport: "Noord ferry connection and bus stops near Mosplein."
  },
  {
    name: "Zuid Local Tobacconist",
    slug: "zuid-local-tobacconist",
    address: "Beethovenstraat 38",
    postalCode: "1077 JJ",
    latitude: 52.348854,
    longitude: 4.878623,
    neighborhood: "Zuid",
    openingHours: [
      { days: weekdays, opens: "09:00", closes: "18:00" },
      { days: ["Saturday"], opens: "10:00", closes: "17:00" }
    ],
    phone: "+31 20 000 1007",
    googleMapsLink: "https://www.google.com/maps/search/?api=1&query=52.348854,4.878623",
    lastUpdated: "2026-05-05",
    status: "published",
    place_type: "tobacco_shop",
    city: "Amsterdam",
    country: "Netherlands",
    wheelchairAccessible: true,
    nearbyPublicTransport: "Tram stops around Beethovenstraat and Amsterdam Zuid station area."
  },
  {
    name: "Zuidoost Tobacco Counter",
    slug: "zuidoost-tobacco-counter",
    address: "Bijlmerplein 685",
    postalCode: "1102 DZ",
    latitude: 52.313591,
    longitude: 4.946872,
    neighborhood: "Zuidoost",
    openingHours: [
      { days: weekdays, opens: "09:00", closes: "18:30" },
      { days: ["Saturday"], opens: "10:00", closes: "17:00" }
    ],
    googleMapsLink: "https://www.google.com/maps/search/?api=1&query=52.313591,4.946872",
    lastUpdated: "2026-05-03",
    status: "published",
    place_type: "other",
    city: "Amsterdam",
    country: "Netherlands",
    wheelchairAccessible: true,
    nearbyPublicTransport: "Amsterdam Bijlmer ArenA station and metro connections nearby."
  }
];

export function getShopBySlug(slug: string, shopList: Shop[] = shops) {
  return shopList.find((shop) => shop.slug === slug);
}

export function getShopsByNeighborhood(neighborhood: string, shopList: Shop[] = shops) {
  return shopList.filter((shop) => normalize(shop.neighborhood) === normalize(neighborhood));
}

export function getShopsNearCentralStation(maxKm = 1.5, shopList: Shop[] = shops) {
  return shopList
    .map((shop) => ({
      shop,
      distance: getDistanceKm(shop, amsterdamCentralStation)
    }))
    .filter(({ distance }) => distance <= maxKm)
    .sort((a, b) => a.distance - b.distance)
    .map(({ shop }) => shop);
}

export function searchShops(query: string, shopList: Shop[] = shops) {
  const value = normalize(query);

  if (!value) {
    return shopList;
  }

  return shopList.filter((shop) => {
    const searchable = normalize([
      shop.name,
      shop.address,
      shop.postalCode,
      shop.neighborhood,
      shop.city,
      shop.country
    ]
      .join(" "));

    return searchable.includes(value);
  });
}

export function normalize(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, "-");
}

export function getPlaceTypeLabel(placeType?: string) {
  if (!placeType) {
    return "Tobacco shop";
  }

  return (
    placeTypes.find((item) => item.value === placeType.trim().toLowerCase())?.label ?? "Other location"
  );
}

export function getDirectionsUrl(
  shop: Pick<Shop, "address" | "city" | "country" | "googleMapsLink" | "latitude" | "longitude" | "name" | "postalCode">
) {
  if (shop.address.trim()) {
    const destination = [shop.name, shop.address, shop.postalCode, shop.city, shop.country]
      .map((item) => item.trim())
      .filter(Boolean)
      .join(", ");

    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
  }

  if (Number.isFinite(shop.latitude) && Number.isFinite(shop.longitude)) {
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${shop.latitude},${shop.longitude}`)}`;
  }

  return shop.googleMapsLink.trim() || null;
}

export function getDistanceKm(shop: Pick<Shop, "latitude" | "longitude">, origin: Coordinates) {
  const earthRadiusKm = 6371;
  const dLat = toRadians(shop.latitude - origin.latitude);
  const dLon = toRadians(shop.longitude - origin.longitude);
  const lat1 = toRadians(origin.latitude);
  const lat2 = toRadians(shop.latitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadiusKm * c;
}

export function formatDistance(distanceKm: number) {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)} m`;
  }

  return `${distanceKm.toFixed(1)} km`;
}

export function formatOpeningHours(slots: OpeningHoursSlot[]) {
  if (slots.length === 0) {
    return ["Opening hours not available."];
  }

  return slots.map((slot) => `${formatDays(slot.days)}: ${slot.opens}-${slot.closes}${slot.note ? ` (${slot.note})` : ""}`);
}

export function getTodayOpeningHours(shop: Shop, date = new Date()) {
  if (shop.openingHours.length === 0) {
    return "Opening hours not available.";
  }

  const today = getAmsterdamDayAndMinutes(date).day;
  const slot = shop.openingHours.find((item) => item.days.includes(today));

  if (!slot) {
    return "Closed today";
  }

  return `${slot.opens}-${slot.closes}${slot.note ? ` (${slot.note})` : ""}`;
}

export function isOpenNow(shop: Shop, date = new Date()) {
  const { day, minutes } = getAmsterdamDayAndMinutes(date);
  const slot = shop.openingHours.find((item) => item.days.includes(day));

  if (!slot) {
    return false;
  }

  const openMinutes = parseTime(slot.opens);
  const closeMinutes = parseTime(slot.closes);

  if (openMinutes === null || closeMinutes === null || openMinutes === closeMinutes) {
    return false;
  }

  if (closeMinutes < openMinutes) {
    return minutes >= openMinutes || minutes < closeMinutes;
  }

  return minutes >= openMinutes && minutes < closeMinutes;
}

export function getOpeningHoursSpecification(shop: Shop) {
  return shop.openingHours.map((slot) => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: slot.days.map((day) => `https://schema.org/${day}`),
    opens: slot.opens,
    closes: slot.closes
  }));
}

function getAmsterdamDayAndMinutes(date: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Amsterdam",
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23"
  }).formatToParts(date);

  const day = (parts.find((part) => part.type === "weekday")?.value ?? "Monday") as DayName;
  const hour = Number(parts.find((part) => part.type === "hour")?.value ?? "0");
  const minute = Number(parts.find((part) => part.type === "minute")?.value ?? "0");

  return {
    day,
    minutes: hour * 60 + minute
  };
}

function parseTime(value: string) {
  const [hour, minute] = value.split(":").map(Number);

  if (!Number.isFinite(hour) || !Number.isFinite(minute)) {
    return null;
  }

  return hour * 60 + minute;
}

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}

function formatDays(days: DayName[]) {
  const indexes = days.map((day) => allDays.indexOf(day)).sort((a, b) => a - b);
  const isSequential = indexes.every((index, position) => position === 0 || index === indexes[position - 1] + 1);

  if (days.length === 1) {
    return days[0];
  }

  if (isSequential) {
    return `${allDays[indexes[0]]}-${allDays[indexes[indexes.length - 1]]}`;
  }

  return days.join(", ");
}
