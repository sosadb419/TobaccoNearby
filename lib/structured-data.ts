import type { DayName, OpeningHoursSlot, Shop } from "@/data/shops";

const siteUrl = "https://tobacconearby.com";
const validDays = new Set<DayName>([
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday"
]);

const dayAbbreviations: Record<DayName, string> = {
  Monday: "Mo",
  Tuesday: "Tu",
  Wednesday: "We",
  Thursday: "Th",
  Friday: "Fr",
  Saturday: "Sa",
  Sunday: "Su"
};

export function generateLocalBusinessJsonLd(shop: Shop) {
  if (shop.status && shop.status !== "published") {
    return null;
  }

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${siteUrl}/shops/${shop.slug}#localbusiness`,
    mainEntityOfPage: `${siteUrl}/shops/${shop.slug}`,
    name: shop.name,
    address: {
      "@type": "PostalAddress",
      streetAddress: shop.address || undefined,
      postalCode: shop.postalCode || undefined,
      addressLocality: shop.city || "Amsterdam",
      addressCountry: getAddressCountry(shop.country)
    },
    url: `${siteUrl}/shops/${shop.slug}`
  };

  if (hasValidCoordinates(shop)) {
    schema.geo = {
      "@type": "GeoCoordinates",
      latitude: shop.latitude,
      longitude: shop.longitude
    };
  }

  if (shop.phone?.trim()) {
    schema.telephone = shop.phone.trim();
  }

  if (shop.website?.trim()) {
    schema.sameAs = shop.website.trim();
  }

  if (shop.googleMapsLink?.trim()) {
    schema.hasMap = shop.googleMapsLink.trim();
  }

  const openingHoursSpecification = getOpeningHoursSpecificationJsonLd(shop.openingHours);
  const openingHours = getOpeningHoursJsonLd(shop.openingHours);

  if (openingHoursSpecification.length > 0) {
    schema.openingHoursSpecification = openingHoursSpecification;
  }

  if (openingHours.length > 0) {
    schema.openingHours = openingHours;
  }

  return schema;
}

function getOpeningHoursJsonLd(slots: OpeningHoursSlot[]) {
  return slots.flatMap((slot) => {
    if (!isValidOpeningHoursSlot(slot)) {
      return [];
    }

    return slot.days.map((day) => `${dayAbbreviations[day]} ${slot.opens}-${slot.closes}`);
  });
}

function getOpeningHoursSpecificationJsonLd(slots: OpeningHoursSlot[]) {
  return slots.flatMap((slot) => {
    if (!isValidOpeningHoursSlot(slot)) {
      return [];
    }

    return [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: slot.days.map((day) => `https://schema.org/${day}`),
        opens: slot.opens,
        closes: slot.closes
      }
    ];
  });
}

function isValidOpeningHoursSlot(slot: OpeningHoursSlot) {
  return (
    !isClosedOpeningHoursSlot(slot) &&
    slot.days.length > 0 &&
    slot.days.every((day) => validDays.has(day)) &&
    isValidTime(slot.opens) &&
    isValidTime(slot.closes) &&
    slot.opens !== slot.closes
  );
}

function isClosedOpeningHoursSlot(slot: OpeningHoursSlot) {
  const note = slot.note?.trim().toLowerCase();

  return note === "closed" || note === "gesloten";
}

function isValidTime(value: string) {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
}

function hasValidCoordinates(shop: Shop) {
  return Number.isFinite(shop.latitude) && Number.isFinite(shop.longitude);
}

function getAddressCountry(country: string) {
  const normalizedCountry = country.trim().toLowerCase();

  if (normalizedCountry === "netherlands" || normalizedCountry === "the netherlands" || normalizedCountry === "nl") {
    return "NL";
  }

  return country || "NL";
}
